import { Component, computed, input } from '@angular/core';
import { STATUS_PRESENTATION } from '../../config/payment-presentation';
import type { ValidationStatus } from '../../models/validation-status.model';
@Component({
  selector: 'app-result-banner',
  templateUrl: './result-banner.component.html',
  styleUrl: './result-banner.component.scss',
})
export class ResultBannerComponent {
  readonly status = input<ValidationStatus>('PENDING');
  readonly paymentId = input<string | null>(null);
  protected readonly presentation = computed(() => STATUS_PRESENTATION[this.status()]);
}
