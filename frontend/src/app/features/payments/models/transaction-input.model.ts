import type { Party } from './party.model';
export interface TransactionInput {
  creditor: Party;
  amount: number;
}
