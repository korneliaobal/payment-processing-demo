import { Component, input } from '@angular/core';
import type { BadgeTone } from '../../models/badge-tone.model';
@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<BadgeTone>('warning');
}
