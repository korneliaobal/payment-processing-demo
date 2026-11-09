import { Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PanelComponent } from '../../../../shared/components/panel/panel.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaymentHistoryStore } from '../../services/payment-history.store';
import { PaymentFlowService } from '../../services/payment-flow.service';
import { STATUS_PRESENTATION } from '../../config/payment-presentation';
import { PAYMENT_ROUTES } from '../../config/payment.config';

@Component({
  selector: 'app-history',
  imports: [DatePipe, DecimalPipe, FormsModule, RouterLink, PanelComponent, AlertComponent, StatusBadgeComponent],
  templateUrl: './payment-history.page.html',
  styleUrl: './payment-history.page.scss',
})
export class PaymentHistoryPage {
  readonly history = inject(PaymentHistoryStore);
  readonly flow = inject(PaymentFlowService);
  readonly presentation = STATUS_PRESENTATION;
  readonly routes = PAYMENT_ROUTES;
  constructor() { this.history.refresh(); }
}
