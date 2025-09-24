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
import { BillingFetcherViaGmail } from './billing';
import { AppConfig } from './config';
import { createNotificationMessage } from './message';
import { createNotifier } from './notify';
import { ScriptPropertyStore } from './property';
import { calculateCostPerPerson } from './calc-amount';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main() {
  // Initialize
  const props = new ScriptPropertyStore();
  const config = new AppConfig(props);

  // Calc
  const billing = new BillingFetcherViaGmail(config.creditCardBilling).fetch();
  const costPerPerson = calculateCostPerPerson(billing);
  const message = createNotificationMessage(costPerPerson);

  // Notify
  const notifier = createNotifier(message, props);
  notifier.notify();
}
