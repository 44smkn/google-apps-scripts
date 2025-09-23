/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { PropertyStore } from './property';
import { NotificationMessage, getCombinationOfSubjectAndBody } from './message';

export class NotifierFactory {
  create(
    notificationMessage: NotificationMessage,
    props: PropertyStore
  ): Notifier {
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
  constructor(
    private recipients: string[],
    private notificationMessage: NotificationMessage
  ) {}

  notify() {
    this.recipients.forEach(recipient => {
      GmailApp.sendEmail(
        recipient,
        this.notificationMessage.subject,
        this.notificationMessage.body
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
      messages: [
        {
          type: 'text',
          text: getCombinationOfSubjectAndBody(this.notificationMessage),
        },
      ],
    };
    const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.channelAccessToken}`,
      },
      payload: JSON.stringify(payload),
    };
    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', params);
  }
}
