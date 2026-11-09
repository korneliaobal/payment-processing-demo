import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { PaymentHistoryStore } from './payment-history.store';

describe('Demo history', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }));
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('filters and paginates the backend array locally', () => {
    const history = TestBed.inject(PaymentHistoryStore);
    history.refresh();
    TestBed.inject(HttpTestingController).expectOne('/api/payments/history').flush(
      Array.from({ length: 21 }, (_, i) => ({
        paymentId: String(i), status: i === 20 ? 'NOT_OK' : 'OK',
        payment: { debtor: { name: 'Demo' }, transactionCount: 1, totalAmount: 10, currency: 'PLN' },
      })),
    );
    expect(history.result().totalElements).toBe(21);
    expect(history.result().content.length).toBe(20);
    history.changePage(1);
    expect(history.result().content[0].paymentId).toBe('20');
    history.changeFilter('NOT_OK');
    expect(history.page()).toBe(0);
    expect(history.result().totalElements).toBe(1);
    expect(history.result().content[0].status).toBe('NOT_OK');
    history.changeFilter('PENDING');
    expect(history.result().content).toEqual([]);
  });
});
