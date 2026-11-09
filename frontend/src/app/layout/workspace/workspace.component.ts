import type { WorkspaceView } from '../../models/workspace-view.model';
import { WORKSPACE_HEADINGS, WORKSPACE_ROUTES } from '../../config/workspace.config';
import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { PaymentFlowService } from '../../features/payments/services/payment-flow.service';
import { PAYMENT_ROUTES } from '../../features/payments/config/payment.config';
import { PAYMENT_STEPS } from '../../features/payments/config/payment-presentation';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
  imports: [RouterLinkActive, RouterLink, RouterOutlet, StepperComponent, AlertComponent],
})
export class WorkspaceComponent {
  protected readonly flow = inject(PaymentFlowService);
  protected readonly steps = PAYMENT_STEPS;
  protected readonly routes = PAYMENT_ROUTES;
  protected readonly workspaceRoutes = WORKSPACE_ROUTES;
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly stage = computed<WorkspaceView>(() => {
    const url = this.url();
    if (url.startsWith(PAYMENT_ROUTES.history)) return 'history';
    if (url.startsWith(PAYMENT_ROUTES.review)) return 'review';
    if (url.startsWith(PAYMENT_ROUTES.new)) return 'form';
    if (url.startsWith(`${PAYMENT_ROUTES.base}/`)) return 'result';
    return 'home';
  });
  protected readonly heading = computed(() => WORKSPACE_HEADINGS[this.stage()]);
  protected readonly isPaymentWorkflow = computed(() =>
    ['form', 'review', 'result'].includes(this.stage()),
  );
}
