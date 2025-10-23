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
import { CreditCardBilling } from './config';

export interface BillingFetcher {
  fetch(): number;
}

export class BillingFetcherViaGmail implements BillingFetcher {
  constructor(
    private config: CreditCardBilling,
    private gmail: GoogleAppsScript.Gmail.GmailApp = GmailApp
  ) {}

  fetch(): number {
    const query = `from:(${this.config.mailAddress}) subject:(${this.config.mailSubject})`;
    const threads = this.gmail.search(query);

    const sorted = threads
      .filter(t => t.getMessageCount() === 2)
      .sort(
        (a, b) =>
          b.getLastMessageDate().getUTCMilliseconds() -
          a.getLastMessageDate().getUTCMilliseconds()
      );
    if (sorted.length === 0) {
      throw Error(`There are no emails that match. query: ${query}`);
    }

    const message = sorted[0].getMessages()[0];
    if (!message) {
      throw Error(`There are no messages in email that match. query: ${query}`);
    }
    console.info(
      `Found email from: ${message.getFrom()}, subject: ${message.getSubject()}`
    );

    const found = message.getBody().match(this.config.extractRegexp);
    if (found == null || found.length < 2) {
      throw Error('Failed to Parse billing amount');
    }

    const billing = Number(found[1].replace(/,/g, ''));

    console.info(`Fetched billing amount: ${billing}`);
    return billing;
  }
}
