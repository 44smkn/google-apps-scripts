export interface NotificationMessage {
  getSubject(): string;
  getBody(): string;
  getCombinationOfSubjectAndBody(): string;
}

export class DefaultNotificationMessage implements NotificationMessage {
  private subject: string;
  private body: string;

  constructor(housingCost: number, billing: number, amountPerCapita: number) {
    const date = new Date();
    this.subject = `${date.getFullYear()}年${date.getMonth() + 1}月分の共通口座への振込金額`;
    this.body = `${billing.toLocaleString()} 円を共通口座に振り込んでください`;
  }

  getSubject(): string {
    return this.subject;
  }

  getBody(): string {
    return this.body;
  }

  getCombinationOfSubjectAndBody(): string {
    return `${this.getSubject()}:
    ${this.getBody()}`;
  }
}
