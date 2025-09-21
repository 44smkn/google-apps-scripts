import {PropertyStore} from './property';
import {NotificationMessage} from './message';

export class NotifierFactory {
  create(notificationMessage: NotificationMessage, props: PropertyStore): Notifier {
    const provider = props.get('notification-provider') ?? 'line';
    switch (provider) {
      case 'line': {
        const token = props.get('line-notify-token');
        const recipient = props.get('line-notify-recipient');
        if (token == null) {
          throw Error('Failed to get line token');
        }
        if (recipient == null) {
          throw Error('Failed to get line recipient');
        }
        return new LINENotifier(token, recipient, notificationMessage);
      }
      case 'email': {
        const recipients = props.get('email-recipients');
        if (recipients == null) {
          throw Error('Failed to get email-recipients');
        }
        return new MailNotifier(recipients.split(','), notificationMessage);
      }
      default:
        throw Error('An unsupported provider name was specified');
    }
  }
}

interface Notifier {
  notify(): void;
}

class MailNotifier implements Notifier {
  constructor(private recipients: string[], private notificationMessage: NotificationMessage) {}

  notify() {
    this.recipients.forEach((recipient) => {
      GmailApp.sendEmail(
        recipient,
        this.notificationMessage.getSubject(),
        this.notificationMessage.getBody()
      );
    });
  }
}

class LINENotifier implements Notifier {
  constructor(
    private channelAccessToken: string,
    private recipient: string,
    private notificationMessage: NotificationMessage
  ) {}

  notify() {
    const payload = {
      to: this.recipient,
      messages: [this.notificationMessage.getCombinationOfSubjectAndBody()],
    };
    const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.channelAccessToken}`,
      },
      payload: JSON.stringify(payload),
    };
    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', params);
  }
}
