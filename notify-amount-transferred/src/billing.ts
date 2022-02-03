import {SharedCreditBilling} from './config';

export interface BillingFetcher {
  fetch(): number;
}

export class BillingFetcherViaGmail implements BillingFetcher {
  constructor(
    private config: SharedCreditBilling,
    private gmail: GoogleAppsScript.Gmail.GmailApp = GmailApp
  ) {}

  fetch(): number {
    const query = `from:(${this.config.mailAddress}) subject:(${this.config.mailSubject})`;
    const threads = this.gmail.search(query);

    const sorted = threads
      .filter((t) => t.getMessageCount() == 1)
      .sort(
        (a, b) =>
          b.getLastMessageDate().getUTCMilliseconds() - a.getLastMessageDate().getUTCMilliseconds()
      );
    if (sorted.length == 0) {
      throw Error(`There are no emails that match. query: ${query}`);
    }

    const messages = sorted[0].getMessages();
    if (messages.length == 0) {
      throw Error(`There are no messsage in email that match. query: ${query}`);
    }

    const found = messages[0].getBody().match(this.config.extractRegexp);
    if (found == undefined) {
      throw Error('Failed to Parse billing amount');
    }

    const billing = Number(found[1].replaceAll(',', ''));
    return billing;
  }
}
