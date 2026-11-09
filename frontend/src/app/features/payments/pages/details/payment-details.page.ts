import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import { PanelComponent } from '../../../../shared/components/panel/panel.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ResultBannerComponent } from '../../components/result-banner/result-banner.component';
import { ValidationRowComponent } from '../../components/validation-row/validation-row.component';
import { PaymentFlowService } from '../../services/payment-flow.service';
import { PaymentResult } from '../../models/payment.model';
import { errorMessage } from '../../payment-error';

@Component({
  selector: 'app-details',
  imports: [JsonPipe, PanelComponent, AlertComponent, ResultBannerComponent, ValidationRowComponent],
  templateUrl: './payment-details.page.html',
  styleUrl: './payment-details.page.scss',
})
export class PaymentDetailsPage {
  private readonly api = inject(PaymentApiService);
  private readonly route = inject(ActivatedRoute);
  readonly flow = inject(PaymentFlowService);
  readonly payment = signal<PaymentResult | null>(null);
  readonly error = signal('');
  readonly showTechnical = signal(false);

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.payment.set(null);
      this.error.set('');
      this.api.details(params.get('id')!).subscribe({
        next: payment => this.payment.set(payment),
        error: error => this.error.set(errorMessage(error)),
      });
    });
  }

  refreshStatus(id: string) {
    this.error.set('');
    this.api.status(id).subscribe({
      next: status => this.payment.update(payment => payment ? { ...payment, status: status.status } : null),
      error: error => this.error.set(errorMessage(error)),
    });
  }
}
