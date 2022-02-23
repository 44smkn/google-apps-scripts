export interface NotificationMessage {
  getSubject(): string;
  getBody(): string;
}

export class DefaultNotificationMessage implements NotificationMessage {
  private subject: string;
  private body: string;

  constructor(housingCost: number, billing: number, amountPerCapita: number) {
    this.subject = `Amount to be transferred to the common account this month: ${amountPerCapita.toLocaleString()} yen`;
    this.body = `
- Rent: ${housingCost.toLocaleString()} yen
- Shared credit card billing: ${billing.toLocaleString()} yen

Please transfer ${amountPerCapita.toLocaleString()} yen per person to the common account.
`;
  }

  getSubject(): string {
    return this.subject;
  }

  getBody(): string {
    return this.body;
  }
}
