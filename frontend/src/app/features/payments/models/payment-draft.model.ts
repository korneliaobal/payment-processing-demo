import type { Currency } from './currency.model';
import type { RecipientDraft } from './recipient.model';
export interface PaymentDraft {
  debtorName: string;
  debtorAccount: string;
  currency: Currency;
  recipients: RecipientDraft[];
}
