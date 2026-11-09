import { Injectable, computed, signal } from '@angular/core';
import { PAYMENT_LIMITS } from '../config/payment.config';
import { EXAMPLE_PAYMENT } from '../data/example-payment';
import type { PaymentDraft } from '../models/payment-draft.model';
import type { RecipientUpdate } from '../models/recipient-update.model';
import {
  calculateTotal,
  createEmptyDraft,
  createRecipient,
  toPaymentInput,
} from '../utils/payment.mapper';
import { isValidDraft } from '../utils/payment.validation';
@Injectable({ providedIn: 'root' })
export class PaymentDraftStore {
  private readonly state = signal(createEmptyDraft());
  readonly value = this.state.asReadonly();
  readonly recipients = computed(() => this.value().recipients);
  readonly total = computed(() => calculateTotal(this.recipients()));
  readonly valid = computed(() => isValidDraft(this.value()));
  readonly payload = computed(() => toPaymentInput(this.value()));
  update(changes: Partial<Omit<PaymentDraft, 'recipients'>>): void {
    this.commit({ ...this.value(), ...changes });
  }
  updateRecipient(update: RecipientUpdate): void {
    this.commit({
      ...this.value(),
      recipients: this.recipients().map((recipient) =>
        recipient.key === update.key ? { ...recipient, ...update.changes } : recipient,
      ),
    });
  }
  addRecipient(): void {
    if (this.recipients().length >= PAYMENT_LIMITS.maxRecipients) return;
    const nextKey = Math.max(...this.recipients().map((recipient) => recipient.key)) + 1;
    this.commit({ ...this.value(), recipients: [...this.recipients(), createRecipient(nextKey)] });
  }
  removeRecipient(key: number): void {
    if (this.recipients().length <= 1) return;
    this.commit({
      ...this.value(),
      recipients: this.recipients().filter((recipient) => recipient.key !== key),
    });
  }
  fillExample(): void {
    this.commit(structuredClone(EXAMPLE_PAYMENT));
  }
  reset(): void {
    this.commit(createEmptyDraft());
  }
  private commit(draft: PaymentDraft): void {
    this.state.set(draft);
  }
}
