import {BillingFetcherViaGmail} from './billing';
import {AppConfig} from './config';
import {AmountTransferredNotificationMessage} from './message';
import {NotifierFactory} from './notify';
import {ScriptPropertyStore} from './property';

function main() {
  // Initialize
  const props = new ScriptPropertyStore();
  const config = new AppConfig(props);

  // Calc
  const billing = new BillingFetcherViaGmail(config.sharedCreditBilling).fetch();
  const message = new AmountTransferredNotificationMessage(billing, config.housingCost.sum());

  // Notify
  const notifier = new NotifierFactory().create(message, props);
  notifier.notify();
}
