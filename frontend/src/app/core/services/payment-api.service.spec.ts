import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PaymentApiService } from './payment-api.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
describe('Payment API flow', () => {
  let api: PaymentApiService; let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }); api = TestBed.inject(PaymentApiService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());
  it('uploads the selected file as multipart and reads status, history and details', () => {
    const file = new File(['{}'], 'payment.json', { type: 'application/json' });
    api.upload(file).subscribe(p => expect(p.status).toBe('OK'));
    const upload = http.expectOne('/api/payments/upload');
    expect(upload.request.method).toBe('POST');
    expect(upload.request.body.get('file')).toBe(file);
    upload.flush({ paymentId: 'abc', status: 'OK' });
    api.status('abc').subscribe(s => expect(s.status).toBe('OK'));
    http.expectOne('/api/payment-status/abc').flush({ paymentId: 'abc', status: 'OK' });
    api.history().subscribe(h => expect(h.length).toBe(1));
    http.expectOne('/api/payments/history').flush([{ paymentId: 'abc' }]);
    api.details('abc').subscribe(p => expect(p.paymentId).toBe('abc'));
    http.expectOne('/api/payments/abc').flush({ paymentId: 'abc' });
  });
  it('propagates upload errors', () => {
    api.upload(new File(['bad'], 'bad.json')).subscribe({ error: e => expect(e.error.detail).toBe('Invalid JSON') });
    http.expectOne('/api/payments/upload').flush({ detail: 'Invalid JSON' }, { status: 400, statusText: 'Bad Request' });
  });
});
