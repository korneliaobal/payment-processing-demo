import { Component, input } from '@angular/core';
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly number = input<string | null>(null);
  readonly counter = input<string | null>(null);
}
