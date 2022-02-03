export interface NotificationMessage {
  getSubject(): string;
  getBody(): string;
}

export class DefaultNotificationMessage implements NotificationMessage {
  private subject: string;
  private body: string;

  constructor(billing: number, housingCost: number) {
    const amountPerCapita = Math.ceil((housingCost + billing) / 2).toLocaleString();

    this.subject = `Amount to be transferred to the common account this month: ${amountPerCapita} yen`;
    this.body = `
- Rent: ${housingCost} yen
- Shared credit card billing: ${billing} yen

Please transfer ${amountPerCapita} yen per person to the common account.
`;
  }

  getSubject(): string {
    return this.subject;
  }

  getBody(): string {
    return this.body;
  }
}
