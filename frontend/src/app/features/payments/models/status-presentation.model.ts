import type { BadgeTone } from '../../../shared/models/badge-tone.model';
export interface StatusPresentation {
  label: string;
  tone: BadgeTone;
  eyebrow: string;
  title: string;
  description: string;
  symbol: string;
}
