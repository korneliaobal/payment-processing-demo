import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PanelComponent } from '../../../../shared/components/panel/panel.component';
import { PaymentSummaryComponent } from '../../components/payment-summary/payment-summary.component';
import { PAYMENT_ROUTES } from '../../config/payment.config';
import { PaymentDraftStore } from '../../services/payment-draft.store';
import { PaymentFlowService } from '../../services/payment-flow.service';
@Component({
  selector: 'app-payment-review',
  imports: [DecimalPipe, RouterLink, PanelComponent, PaymentSummaryComponent],
  templateUrl: './payment-review.page.html',
  styleUrl: './payment-review.page.scss',
})
export class PaymentReviewPage {
  protected readonly draft = inject(PaymentDraftStore);
  protected readonly flow = inject(PaymentFlowService);
  protected readonly routes = PAYMENT_ROUTES;
}
