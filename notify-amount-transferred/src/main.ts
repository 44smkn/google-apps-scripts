import {BillingFetcherViaGmail} from './billing';
import {AppConfig} from './config';
import {DefaultNotificationMessage} from './message';
import {NotifierFactory} from './notify';
import {ScriptPropertyStore} from './property';

// Google Apps Script does not support ES modules
// https://github.com/google/clasp/blob/master/docs/typescript.md#the-exports-declaration-workaround
declare const calcAmount: typeof import('./calc-amount');

function main() {
  // Initialize
  const props = new ScriptPropertyStore();
  const config = new AppConfig(props);

  // Calc
  const billing = new BillingFetcherViaGmail(config.sharedCreditBilling).fetch();
  const housingCost = config.housingCost.sum();
  const amountPerCapita = calcAmount.calculateAmountPerCapita(housingCost, billing);
  const message = new DefaultNotificationMessage(housingCost, billing, amountPerCapita);

  // Notify
  const notifier = new NotifierFactory().create(message, props);
  notifier.notify();
}
