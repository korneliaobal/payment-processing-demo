import type { PaymentDraft } from '../models/payment-draft.model';
export const EXAMPLE_PAYMENT: PaymentDraft = {
  debtorName: 'Nova Studio Sp. z o.o.',
  debtorAccount: 'PL61109010140000071219812874',
  currency: 'PLN',
  recipients: [
    { key: 1, name: 'Anna Kowalska', accountNumber: 'PL10105000997603123456789123', amount: 1250 },
    { key: 2, name: 'Piotr Nowak', accountNumber: 'PL60102010260000042270201111', amount: 840.5 },
  ],
};
