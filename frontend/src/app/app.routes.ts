import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardPage } from './features/home/pages/home/home.page';
import { HomePage } from './features/payments/pages/home/home.page';
import { PaymentHistoryPage } from './features/payments/pages/history/payment-history.page';
import { PaymentDetailsPage } from './features/payments/pages/details/payment-details.page';
import { PaymentReviewPage } from './features/payments/pages/payment-review/payment-review.page';
import { PaymentDraftStore } from './features/payments/services/payment-draft.store';
import { PaymentFlowService } from './features/payments/services/payment-flow.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardPage },
  { path: 'payments/new', component: HomePage },
  {
    path: 'payments/review', component: PaymentReviewPage,
    canActivate: [() => inject(PaymentDraftStore).valid() || inject(Router).parseUrl('/payments/new')],
    canDeactivate: [() => !inject(PaymentFlowService).isUploading()],
  },
  { path: 'payments/history', component: PaymentHistoryPage },
  { path: 'payments/:id', component: PaymentDetailsPage },
  { path: '**', redirectTo: '' },
];
