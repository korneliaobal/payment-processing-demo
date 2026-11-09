import { validationReasonLabel } from '../../utils/validation-reasons';
import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { DEFAULT_CURRENCY } from '../../config/payment.config';
import { STATUS_PRESENTATION } from '../../config/payment-presentation';
import type { ValidationStatus } from '../../models/validation-status.model';
@Component({
  selector: 'app-validation-row',
  templateUrl: './validation-row.component.html',
  styleUrl: './validation-row.component.scss',
  imports: [DecimalPipe, StatusBadgeComponent],
})
export class ValidationRowComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly amount = input<number | null>(null);
  readonly currency = input<string>(DEFAULT_CURRENCY);
  readonly status = input<ValidationStatus>('PENDING');
  readonly reasonCodes = input<readonly string[]>([]);
  protected readonly reasons = computed(() => this.reasonCodes().map(validationReasonLabel));
  protected readonly presentation = computed(() => STATUS_PRESENTATION[this.status()]);
}
