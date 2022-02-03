import {PropertyStore} from './property';

export class AppConfig {
  private _sharedCreditBilling: SharedCreditBilling;
  private _notification: Notification;
  private _housingCost: HousingCost;

  constructor(props: PropertyStore) {
    this._sharedCreditBilling = new SharedCreditBilling(props);
    this._notification = new Notification(props);
    this._housingCost = new HousingCost(props);
  }

  get sharedCreditBilling() {
    return this._sharedCreditBilling;
  }

  get notification() {
    return this._notification;
  }

  get housingCost() {
    return this._housingCost;
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

class HousingCost {
  private _rent: number;
  private _maintenanceFee: number;

  constructor(props: PropertyStore) {
    const rentKey = 'rent';
    const maintenanceFeeKey = 'maintenance-fee';

    this._rent = Number(getProperty(props, rentKey));
    this._maintenanceFee = Number(getProperty(props, maintenanceFeeKey));
  }

  get rent() {
    return this._rent;
  }

  get maintenanceFee() {
    return this._maintenanceFee;
  }

  sum(): number {
    return this._rent + this._maintenanceFee;
  }
}

function getProperty(props: PropertyStore, key: string): string {
  const val = props.get(key);
  if (val == null) {
    throw Error(`Not found key ${key} in propety store`);
  }
  return val;
}
