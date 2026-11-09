import type { Party } from './party.model';
import type { ValidationStatus } from './validation-status.model';

export type Status = ValidationStatus;

export interface Validation {
  status: Status;
  reasons: string[];
}

export interface PaymentResult {
  paymentId: string;
  createdAt: string;
  status: Status;
  payment: {
    debtor: Party;
    currency: string;
    totalAmount: number;
    transactionCount: number;
  };
  paymentValidation: Validation;
  transactions: {
    index: number;
    transaction: { creditor: Party; amount: number };
    validation: Validation;
  }[];
}
