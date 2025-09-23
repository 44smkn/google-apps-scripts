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
  private _sharedCreditBilling: SharedCreditBilling;
  private _notification: Notification;

  constructor(props: PropertyStore) {
    this._sharedCreditBilling = new SharedCreditBilling(props);
    this._notification = new Notification(props);
  }

  get sharedCreditBilling() {
    return this._sharedCreditBilling;
  }

  get notification() {
    return this._notification;
  }
}

export class SharedCreditBilling {
  private _mailAddress: string;
  private _mailSubject: string;
  private _extractRegexp: RegExp;

  constructor(props: PropertyStore) {
    const mailAddressKey = 'shared-credit-billing-mail-address';
    const mailSubjectKey = 'shared-credit-billing-mail-subject';
    const extractRegexpKey = 'shared-credit-billing-extract-regexp';

    this._mailAddress = getProperty(props, mailAddressKey);
    this._mailSubject = getProperty(props, mailSubjectKey);
    this._extractRegexp = new RegExp(getProperty(props, extractRegexpKey));
  }

  get mailAddress() {
    return this._mailAddress;
  }

  get mailSubject() {
    return this._mailSubject;
  }

  get extractRegexp() {
    return this._extractRegexp;
  }
}

class Notification {
  private _notificationProvider: string;
  private _lineNotifyToken: string;
  private _emailRecipients: string;

  constructor(props: PropertyStore) {
    const notificationProviderKey = 'notification-provider';
    const lineNotifyTokenKey = 'line-notify-token';
    const emailRecipientsKey = 'email-recipients';

    this._notificationProvider = getProperty(props, notificationProviderKey);
    this._lineNotifyToken = getProperty(props, lineNotifyTokenKey);
    this._emailRecipients = getProperty(props, emailRecipientsKey);
  }

  get notificationProvider() {
    return this._notificationProvider;
  }

  get lineNotifyToken() {
    return this._lineNotifyToken;
  }

  get emailRecipients() {
    return this._emailRecipients;
  }
}

function getProperty(props: PropertyStore, key: string): string {
  const val = props.get(key);
  if (val == null) {
    throw Error(`Not found key ${key} in propety store`);
  }
  return val;
}
