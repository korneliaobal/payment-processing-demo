import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentResult, Status } from '../../features/payments/models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private readonly http = inject(HttpClient);

  upload(file: File) {
    const data = new FormData();
    data.append('file', file);
    return this.http.post<PaymentResult>('/api/payments/upload', data);
  }

  history() {
    return this.http.get<PaymentResult[]>('/api/payments/history');
  }

  details(id: string) {
    return this.http.get<PaymentResult>('/api/payments/' + encodeURIComponent(id));
  }

  status(id: string) {
    return this.http.get<{ paymentId: string; status: Status }>(
      '/api/payment-status/' + encodeURIComponent(id),
    );
  }
}
