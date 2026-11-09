import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { ButtonType } from '../../../../shared/models/button-type.model';
import type { Currency } from '../../models/currency.model';
@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrl: './payment-summary.component.scss',
  imports: [DecimalPipe],
})
export class PaymentSummaryComponent {
  readonly amount = input.required<number>();
  readonly currency = input.required<Currency>();
  readonly transactionCount = input.required<number>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly actionLabel = input.required<string>();
  readonly footnote = input('');
  readonly showPaymentType = input(false);
  readonly busy = input(false);
  readonly actionType = input<ButtonType>('button');
  readonly action = output<void>();
}
