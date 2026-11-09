import type { Currency } from './currency.model';
import type { Party } from './party.model';
import type { TransactionInput } from './transaction-input.model';
export interface PaymentInput {
  debtor: Party;
  currency: Currency;
  transactionCount: number;
  totalAmount: number;
  transactions: TransactionInput[];
}
