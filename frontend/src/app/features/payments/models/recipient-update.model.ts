import type { RecipientDraft } from './recipient.model';
export interface RecipientUpdate {
  key: number;
  changes: Partial<Omit<RecipientDraft, 'key'>>;
}
