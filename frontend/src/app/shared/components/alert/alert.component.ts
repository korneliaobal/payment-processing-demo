import { Component, input } from '@angular/core';
import type { AlertTone } from '../../models/alert-tone.model';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  readonly message = input.required<string>();
  readonly tone = input<AlertTone>('info');
}
