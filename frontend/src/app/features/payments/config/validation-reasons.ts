import type { ValidationReason } from '../models/validation-reason.model';
export const VALIDATION_REASONS: Record<ValidationReason, string> = {
  DEBTOR_NAME_REQUIRED: 'Brak nazwy nadawcy.',
  DEBTOR_ACCOUNT_INVALID: 'Numer konta nadawcy ma nieprawidłowy format lub sumę kontrolną.',
  TRANSACTION_COUNT_OUT_OF_RANGE: 'Płatność musi zawierać od 1 do 5 transakcji.',
  CREDITOR_NAME_REQUIRED: 'Brak nazwy odbiorcy.',
  CREDITOR_ACCOUNT_INVALID: 'Numer konta odbiorcy ma nieprawidłowy format lub sumę kontrolną.',
  AMOUNT_INVALID: 'Kwota transakcji jest nieprawidłowa.',
  AMOUNT_BELOW_MINIMUM: 'Kwota transakcji musi być większa niż 5 jednostek waluty płatności.',
};
