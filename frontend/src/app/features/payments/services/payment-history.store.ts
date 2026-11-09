import { Injectable, computed, inject, signal } from '@angular/core';
import { PaymentApiService } from '../../../core/services/payment-api.service';
import { PaymentResult, Status } from '../models/payment.model';
import { errorMessage } from '../payment-error';

@Injectable({ providedIn: 'root' })
export class PaymentHistoryStore {
  private readonly api = inject(PaymentApiService);
  readonly payments = signal<PaymentResult[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly filter = signal<Status | ''>('');
  readonly page = signal(0);
  readonly updatedAt = signal<Date | null>(null);
  private readonly pageSize = 20;
  readonly filtered = computed(() => this.payments().filter(p => !this.filter() || p.status === this.filter()));
  readonly result = computed(() => ({
    content: this.filtered().slice(this.page() * this.pageSize, (this.page() + 1) * this.pageSize)
      .map(p => ({ ...p, ...p.payment, debtor: p.payment.debtor })),
    number: this.page(),
    totalElements: this.filtered().length,
    totalPages: Math.ceil(this.filtered().length / this.pageSize),
  }));

  refresh() {
    this.loading.set(true);
    this.error.set('');
    this.api.history().subscribe({
      next: payments => {
        this.payments.set(payments);
        this.page.set(Math.min(this.page(), Math.max(0, this.result().totalPages - 1)));
        this.updatedAt.set(new Date());
        this.loading.set(false);
      },
      error: error => { this.error.set(errorMessage(error)); this.loading.set(false); },
    });
  }

  changeFilter(status: Status | '') { this.filter.set(status); this.page.set(0); }
  changePage(page: number) {
    this.page.set(Math.max(0, Math.min(page, Math.max(0, this.result().totalPages - 1))));
  }
}
