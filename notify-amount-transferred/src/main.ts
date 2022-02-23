import {BillingFetcherViaGmail} from './billing';
import {calculateAmountPerCapita} from './calc-amount';
import {AppConfig} from './config';
import {DefaultNotificationMessage} from './message';
import {NotifierFactory} from './notify';
import {ScriptPropertyStore} from './property';

function main() {
  // Initialize
  const props = new ScriptPropertyStore();
  const config = new AppConfig(props);

  // Calc
  const billing = new BillingFetcherViaGmail(config.sharedCreditBilling).fetch();
  const housingCost = config.housingCost.sum();
  const amountPerCapita = calculateAmountPerCapita(housingCost, billing);
  const message = new DefaultNotificationMessage(housingCost, billing, amountPerCapita);

  // Notify
  const notifier = new NotifierFactory().create(message, props);
  notifier.notify();
}
