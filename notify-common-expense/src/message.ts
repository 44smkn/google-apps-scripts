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
import { calculateCommonExpensePerPerson } from './calc-amount';

export interface NotificationMessage {
  getSubject(): string;
  getBody(): string;
  getCombinationOfSubjectAndBody(): string;
}

export class DefaultNotificationMessage implements NotificationMessage {
  private subject: string;
  private body: string;

  constructor(billing: number) {
    const date = new Date();
    const commonExpensePerPerson = calculateCommonExpensePerPerson(billing);
    this.subject = `${date.getFullYear()}年${date.getMonth() + 1}月分の共通口座への振込金額通知`;
    this.body = `${commonExpensePerPerson.toLocaleString()} 円を月末までに共通口座に振り込んでください`;
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
