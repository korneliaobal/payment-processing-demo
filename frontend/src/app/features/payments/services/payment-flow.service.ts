import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentApiService } from '../../../core/services/payment-api.service';
import { PaymentDraftStore } from './payment-draft.store';
import { errorMessage } from '../payment-error';

@Injectable({ providedIn: 'root' })
export class PaymentFlowService {
  private readonly api = inject(PaymentApiService);
  private readonly draft = inject(PaymentDraftStore);
  private readonly router = inject(Router);
  readonly isUploading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  setError(message: string | null) { this.errorMessage.set(message); }

  submit() {
    if (this.isUploading()) return;
    this.isUploading.set(true);
    this.setError(null);
    const file = new File([JSON.stringify(this.draft.payload())], 'payment.json', { type: 'application/json' });
    this.api.upload(file).subscribe({
      next: payment => {
        this.isUploading.set(false);
        void this.router.navigate(['/payments', payment.paymentId]);
      },
      error: error => {
        this.isUploading.set(false);
        this.setError(errorMessage(error));
      },
    });
  }

  reset() {
    this.draft.reset();
    this.setError(null);
    void this.router.navigate(['/payments/new']);
  }
}
