import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { PaymentDraftStore } from './payment-draft.store';
import { PaymentFlowService } from './payment-flow.service';

describe('Demo form submission', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] }));
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('submits the reviewed form as JSON multipart and immediately opens its result without polling', async () => {
    const draft = TestBed.inject(PaymentDraftStore);
    draft.fillExample();
    expect(draft.valid()).toBe(true);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const flow = TestBed.inject(PaymentFlowService);
    flow.submit();
    flow.submit(); // Repeated clicks must not upload twice.
    const request = TestBed.inject(HttpTestingController).expectOne('/api/payments/upload');
    const file = request.request.body.get('file') as File;
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
    expect(JSON.parse(content)).toEqual(draft.payload());
    request.flush({ paymentId: 'demo-id', status: 'OK' });
    expect(flow.isUploading()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/payments', 'demo-id']);
  });

  it('keeps the draft and permits retry when upload fails', () => {
    const draft = TestBed.inject(PaymentDraftStore);
    draft.fillExample();
    const before = draft.payload();
    const flow = TestBed.inject(PaymentFlowService);
    flow.submit();
    TestBed.inject(HttpTestingController).expectOne('/api/payments/upload')
      .flush({ detail: 'Invalid payment' }, { status: 400, statusText: 'Bad Request' });
    expect(flow.isUploading()).toBe(false);
    expect(flow.errorMessage()).toBe('Invalid payment');
    expect(draft.payload()).toEqual(before);
  });
});
