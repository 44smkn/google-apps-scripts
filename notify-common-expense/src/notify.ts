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

/** Supported notification provider types. */
type NotificationProvider = 'line' | 'email';

/** Factory class for creating notification instances. */
export class NotifierFactory {
  /**
   * Creates a notifier instance based on the specified provider.
   * @param notificationMessage The message to be sent.
   * @param props Property store containing configuration.
   * @returns A notifier instance.
   */
  create(
    notificationMessage: NotificationMessage,
    props: PropertyStore
  ): Notifier {
    const provider = (props.get('notification-provider') ??
      'line') as NotificationProvider;

    switch (provider) {
      case 'line': {
        const token = props.get('line-notify-token');
        const recipient = props.get('line-notify-recipient');
        if (!token) {
          throw new Error('LINE notification token is required but not found');
        }
        if (!recipient) {
          throw new Error(
            'LINE notification recipient is required but not found'
          );
        }
        return new LINENotifier(token, recipient, notificationMessage);
      }
      case 'email': {
        const recipients = props.get('email-recipients');
        if (!recipients) {
          throw new Error('Email recipients are required but not found');
        }
        return new MailNotifier(recipients.split(','), notificationMessage);
      }
      default:
        throw new Error(`Unsupported notification provider: ${provider}`);
    }
  }
}

/** Interface for notification providers. */
interface Notifier {
  /** Sends the notification. */
  notify(): void;
}

/** Email notification implementation. */
class MailNotifier implements Notifier {
  constructor(
    private readonly recipients: readonly string[],
    private readonly notificationMessage: NotificationMessage
  ) {}

  notify(): void {
    this.recipients.forEach(recipient => {
      GmailApp.sendEmail(
        recipient,
        this.notificationMessage.subject,
        this.notificationMessage.body
      );
    });
  }
}

/** LINE notification implementation. */
class LINENotifier implements Notifier {
  private static readonly LINE_API_URL =
    'https://api.line.me/v2/bot/message/push';

  constructor(
    private readonly channelAccessToken: string,
    private readonly recipient: string,
    private readonly notificationMessage: NotificationMessage
  ) {}

  notify(): void {
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
    UrlFetchApp.fetch(LINENotifier.LINE_API_URL, params);
  }
}
