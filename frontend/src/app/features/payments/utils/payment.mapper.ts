import { DEFAULT_CURRENCY } from '../config/payment.config';
import type { PaymentDraft } from '../models/payment-draft.model';
import type { PaymentInput } from '../models/payment-input.model';
import type { RecipientDraft } from '../models/recipient.model';
import { normalizeAccount } from './payment.validation';
export function createRecipient(key: number): RecipientDraft {
  return { key, name: '', accountNumber: '', amount: null };
}
export function createEmptyDraft(): PaymentDraft {
  return {
    debtorName: '',
    debtorAccount: '',
    currency: DEFAULT_CURRENCY,
    recipients: [createRecipient(1)],
  };
}
export function calculateTotal(recipients: readonly RecipientDraft[]): number {
  return (
    recipients.reduce((sum, recipient) => sum + Math.round((recipient.amount ?? 0) * 100), 0) / 100
  );
}
export function toPaymentInput(draft: PaymentDraft): PaymentInput {
  return {
    debtor: { name: draft.debtorName.trim(), accountNumber: normalizeAccount(draft.debtorAccount) },
    currency: draft.currency,
    transactionCount: draft.recipients.length,
    totalAmount: calculateTotal(draft.recipients),
    transactions: draft.recipients.map((recipient) => ({
      creditor: {
        name: recipient.name.trim(),
        accountNumber: normalizeAccount(recipient.accountNumber),
      },
      amount: Math.round((recipient.amount ?? 0) * 100) / 100,
    })),
  };
}
