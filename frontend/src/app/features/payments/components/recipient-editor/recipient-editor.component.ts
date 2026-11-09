import { BankAccountValidatorDirective } from '../../../../shared/directives/bank-account-validator.directive';
import { Component, inject, input, output } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';
import type { Currency } from '../../models/currency.model';
import type { RecipientDraft } from '../../models/recipient.model';
import type { RecipientUpdate } from '../../models/recipient-update.model';
import { PAYMENT_LIMITS } from '../../config/payment.config';
@Component({
  selector: 'app-recipient-editor',
  templateUrl: './recipient-editor.component.html',
  styleUrl: './recipient-editor.component.scss',
  imports: [BankAccountValidatorDirective, FormsModule],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
})
export class RecipientEditorComponent {
  readonly recipient = input.required<RecipientDraft>();
  readonly currency = input.required<Currency>();
  readonly index = input.required<number>();
  readonly canRemove = input(false);
  readonly changed = output<RecipientUpdate>();
  readonly removed = output<number>();
  protected readonly limits = PAYMENT_LIMITS;
}
