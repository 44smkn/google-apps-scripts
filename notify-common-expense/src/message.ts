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

export type NotificationMessage = {
  subject: string;
  body: string;
};

export function calculateCostPerPerson(billing: number): number {
  const costPerPerson = billing / 2;
  // 123,456 -> 124,000
  return Math.ceil(costPerPerson / 1000) * 1000;
}

export function createNotificationMessage(
  costPerPerson: number
): NotificationMessage {
  const date = new Date();
  const subject = `${date.getFullYear()}年${date.getMonth() + 1}月分の共通口座への振込金額通知`;
  const body = `${costPerPerson.toLocaleString()} 円を月末までに共通口座に振り込んでください`;

  return { subject, body };
}

export function getCombinationOfSubjectAndBody(
  message: NotificationMessage
): string {
  return `${message.subject}:
${message.body}`;
}
