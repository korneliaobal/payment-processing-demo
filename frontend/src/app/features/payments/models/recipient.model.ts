import type { Party } from './party.model';
export interface RecipientDraft extends Party {
  key: number;
  amount: number | null;
}
