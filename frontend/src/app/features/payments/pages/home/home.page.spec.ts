import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { HomePage } from './home.page';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
describe('Upload page', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HomePage], providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] }));
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('disables upload until a file is selected and navigates after success', () => {
    const fixture = TestBed.createComponent(HomePage); fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('[data-testid=upload]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fixture.componentInstance.file.set(new File(['{}'], 'payment.json')); fixture.detectChanges();
    expect(button.disabled).toBe(false);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    button.click();
    expect(fixture.componentInstance.busy()).toBe(true);
    TestBed.inject(HttpTestingController).expectOne('/api/payments/upload').flush({ paymentId: 'abc', status: 'OK' });
    expect(navigate).toHaveBeenCalledWith(['/payments', 'abc']);
    expect(fixture.componentInstance.busy()).toBe(false);
  });
  it('shows an error and enables retry after a rejected upload', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.componentInstance.file.set(new File(['bad'], 'bad.json')); fixture.componentInstance.upload();
    TestBed.inject(HttpTestingController).expectOne('/api/payments/upload').flush({ detail: 'Invalid JSON' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=alert]').textContent).toContain('Invalid JSON');
    expect(fixture.nativeElement.querySelector('[data-testid=upload]').disabled).toBe(false);
  });
});
