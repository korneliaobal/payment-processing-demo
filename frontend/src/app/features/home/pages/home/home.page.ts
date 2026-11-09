import { Component, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PanelComponent } from '../../../../shared/components/panel/panel.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaymentHistoryStore } from '../../../payments/services/payment-history.store';
import { PaymentFlowService } from '../../../payments/services/payment-flow.service';
import { STATUS_PRESENTATION } from '../../../payments/config/payment-presentation';
import { PAYMENT_ROUTES } from '../../../payments/config/payment.config';
import { DASHBOARD_METRICS } from '../../config/dashboard.config';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, DecimalPipe, RouterLink, PanelComponent, AlertComponent, MetricCardComponent, StatusBadgeComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class DashboardPage {
  private readonly history = inject(PaymentHistoryStore);
  readonly flow = inject(PaymentFlowService);
  readonly presentation = STATUS_PRESENTATION;
  readonly routes = PAYMENT_ROUTES;
  readonly metrics = DASHBOARD_METRICS;
  readonly dashboard = {
    refresh: () => this.history.refresh(),
    error: this.history.error,
    loading: this.history.loading,
    updatedAt: this.history.updatedAt,
    data: computed(() => this.history.updatedAt() ? {
      counts: {
        total: this.history.payments().length,
        pending: this.history.payments().filter(p => p.status === 'PENDING').length,
        accepted: this.history.payments().filter(p => p.status === 'OK').length,
        rejected: this.history.payments().filter(p => p.status === 'NOT_OK').length,
      },
      recentPayments: this.history.payments().slice(0, 5).map(p => ({ ...p, ...p.payment })),
    } : null),
  };
  constructor() { this.history.refresh(); }
}
