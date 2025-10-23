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

export class AppConfig {
  readonly creditCardBilling: CreditCardBilling;
  readonly notification: Notification;

  constructor(props: PropertyStore) {
    this.creditCardBilling = new CreditCardBilling(props);
    this.notification = new Notification(props);
  }
}

export class CreditCardBilling {
  readonly mailAddress: string;
  readonly mailSubject: string;
  readonly extractRegexp: RegExp;

  constructor(props: PropertyStore) {
    const mailAddressKey = 'shared-credit-billing-mail-address';
    const mailSubjectKey = 'shared-credit-billing-mail-subject';
    const extractRegexpKey = 'shared-credit-billing-extract-regexp';

    this.mailAddress = getProperty(props, mailAddressKey);
    this.mailSubject = getProperty(props, mailSubjectKey);
    this.extractRegexp = new RegExp(getProperty(props, extractRegexpKey));
  }
}

class Notification {
  readonly notificationProvider: string;
  readonly lineNotifyToken: string;
  readonly emailRecipients: string;

  constructor(props: PropertyStore) {
    const notificationProviderKey = 'notification-provider';
    const lineNotifyTokenKey = 'line-notify-token';
    const emailRecipientsKey = 'email-recipients';

    this.notificationProvider = getProperty(props, notificationProviderKey);
    this.lineNotifyToken = getProperty(props, lineNotifyTokenKey);
    this.emailRecipients = getProperty(props, emailRecipientsKey);
  }
}

function getProperty(props: PropertyStore, key: string): string {
  const val = props.get(key);
  if (val == null) {
    console.error('Error occurred:', `Not found key ${key} in property store`);
    throw Error(`Not found key ${key} in property store`);
  }
  return val;
}
