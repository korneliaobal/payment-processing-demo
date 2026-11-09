import { Directive, forwardRef } from '@angular/core';
import type { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { NG_VALIDATORS } from '@angular/forms';
import { isValidBankAccount } from '../utils/bank-account.utils';

@Directive({
  selector: '[appBankAccount][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BankAccountValidatorDirective),
      multi: true,
    },
  ],
})
export class BankAccountValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return !control.value || isValidBankAccount(control.value) ? null : { bankAccount: true };
  }
}
