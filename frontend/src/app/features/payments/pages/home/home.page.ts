import { Component, inject, signal } from '@angular/core';
import { PaymentFormPage } from '../payment-form/payment-form.page';
import { PanelComponent } from '../../../../shared/components/panel/panel.component';
import { Router } from '@angular/router';
import { PaymentApiService } from '../../../../core/services/payment-api.service';
import { errorMessage } from '../../payment-error';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [PaymentFormPage, PanelComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  private readonly api = inject(PaymentApiService);
  private readonly router = inject(Router);

  readonly file = signal<File | undefined>(undefined);
  readonly busy = signal(false);
  readonly error = signal('');

  select(event: Event) {
    this.file.set((event.target as HTMLInputElement).files?.[0]);
    this.error.set('');
  }

  upload() {
    const file = this.file();
    if (!file || this.busy()) return;
    if (file.size > 1048576) {
      this.error.set('Maximum file size is 1 MB.');
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.api.upload(file).subscribe({
      next: payment => {
        this.busy.set(false);
        void this.router.navigate(['/payments', payment.paymentId]);
      },
      error: error => {
        this.busy.set(false);
        this.error.set(errorMessage(error));
      },
    });
  }
}
