export interface NotificationMessage {
  subject: string;
  body: string;
}

export class DefaultNotificationMessage implements NotificationMessage {
  private _subject: string;
  private _body: string;

  constructor(billing: number, housingCost: number) {
    const amountPerCapita = Math.ceil((housingCost + billing) / 2).toLocaleString();

    this._subject = `Amount to be transferred to the common account this month: ${amountPerCapita} yen`;
    this._body = `
- Rent: ${housingCost} yen
- Shared credit card billing: ${billing} yen

Please transfer ${amountPerCapita} yen per person to the common account.
`;
  }

  get subject() {
    return this._subject;
  }

  get body() {
    return this._body;
  }
}
