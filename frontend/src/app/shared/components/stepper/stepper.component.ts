import { Component, input } from '@angular/core';
import type { Step } from '../../models/step.model';
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  readonly steps = input.required<readonly Step[]>();
  readonly activeStep = input.required<string>();
  readonly label = input.required<string>();
}
