import type { Currency } from '../models/currency.model';
export const SUPPORTED_CURRENCIES: readonly Currency[] = ['PLN', 'EUR', 'USD', 'GBP'];
export const DEFAULT_CURRENCY: Currency = 'PLN';
export const PAYMENT_LIMITS = {
  maxRecipients: 5,
  maxNameLength: 150,
  minAmount: 0.01,
  maxAmount: 999999999,
  accountPlaceholder: 'PL00 0000 0000 0000 0000 0000 0000',
} as const;
export const PAYMENT_HISTORY = { pageSize: 20 } as const;
export const PAYMENT_ROUTES = { base: '/payments', new: '/payments/new', review: '/payments/review', history: '/payments/history' } as const;
