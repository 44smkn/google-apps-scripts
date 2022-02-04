import {PropertyStore} from './property';
import {NotificationMessage} from './message';

export class NotifierFactory {
  create(notificationMessage: NotificationMessage, props: PropertyStore): Notifier {
    const provider = props.get('notification-provider') ?? 'line';
    switch (provider) {
      case 'line': {
        const token = props.get('line-notify-token');
        if (token == null) {
          throw Error('Failed to get line token');
        }
        return new LINENotifier(token, notificationMessage);
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
        this.notificationMessage.subject,
        this.notificationMessage.body
      );
    });
  }
}

class LINENotifier implements Notifier {
  constructor(private token: string, private notificationMessage: NotificationMessage) {}

  notify() {
    const formData = {
      message: this.notificationMessage.body,
    };
    const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      payload: formData,
    };
    UrlFetchApp.fetch('https://notify-api.line.me/api/notify', params);
  }
}
