import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { MetricTone } from '../../models/metric-tone.model';
@Component({
  selector: 'app-metric-card',
  imports: [DecimalPipe],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input<number | null>(null);
  readonly tone = input<MetricTone>('neutral');
  readonly description = input('');
}
