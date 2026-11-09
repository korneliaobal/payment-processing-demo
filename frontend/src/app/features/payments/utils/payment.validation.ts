import { isValidBankAccount, normalizeBankAccount } from '../../../shared/utils/bank-account.utils';
import { PAYMENT_LIMITS, SUPPORTED_CURRENCIES } from '../config/payment.config';
import type { Currency } from '../models/currency.model';
import type { PaymentDraft } from '../models/payment-draft.model';
export function normalizeAccount(value: string): string {
  return normalizeBankAccount(value);
}
export function isPaymentId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}
export function isCurrency(value: unknown): value is Currency {
  return SUPPORTED_CURRENCIES.some((currency) => currency === value);
}
export function isValidAmount(value: number | null): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= PAYMENT_LIMITS.minAmount &&
    value <= PAYMENT_LIMITS.maxAmount &&
    Math.abs(value * 100 - Math.round(value * 100)) < 0.000001
  );
}
export function isValidDraft(draft: PaymentDraft): boolean {
  const validName = (name: string) =>
    Boolean(name.trim()) && name.length <= PAYMENT_LIMITS.maxNameLength;
  const validAccount = isValidBankAccount;
  return (
    validName(draft.debtorName) &&
    validAccount(draft.debtorAccount) &&
    isCurrency(draft.currency) &&
    draft.recipients.length >= 1 &&
    draft.recipients.length <= PAYMENT_LIMITS.maxRecipients &&
    draft.recipients.every(
      (recipient) =>
        validName(recipient.name) &&
        validAccount(recipient.accountNumber) &&
        isValidAmount(recipient.amount),
    )
  );
}
