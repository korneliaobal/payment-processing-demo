import { BankAccountValidatorDirective } from '../../../../shared/directives/bank-account-validator.directive';
import { Component, inject } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PanelComponent } from '../../../../shared/components/panel/panel.component';
import { RecipientEditorComponent } from '../../components/recipient-editor/recipient-editor.component';
import { PaymentSummaryComponent } from '../../components/payment-summary/payment-summary.component';
import { PAYMENT_LIMITS, PAYMENT_ROUTES, SUPPORTED_CURRENCIES } from '../../config/payment.config';
import { PAYMENT_MESSAGES } from '../../config/payment-messages';
import { PaymentDraftStore } from '../../services/payment-draft.store';
import { PaymentFlowService } from '../../services/payment-flow.service';
@Component({
  selector: 'app-payment-form',
  imports: [
    BankAccountValidatorDirective,
    FormsModule,
    PanelComponent,
    RecipientEditorComponent,
    PaymentSummaryComponent,
  ],
  templateUrl: './payment-form.page.html',
  styleUrl: './payment-form.page.scss',
})
export class PaymentFormPage {
  protected readonly draft = inject(PaymentDraftStore);
  protected readonly flow = inject(PaymentFlowService);
  protected readonly limits = PAYMENT_LIMITS;
  protected readonly currencies = SUPPORTED_CURRENCIES;
  private readonly router = inject(Router);
  protected review(form: NgForm): void {
    form.form.markAllAsTouched();
    if (form.invalid || !this.draft.valid()) {
      this.flow.setError(PAYMENT_MESSAGES.invalidDraft);
      return;
    }
    this.flow.setError(null);
    void this.router.navigate([PAYMENT_ROUTES.review]);
  }
}
