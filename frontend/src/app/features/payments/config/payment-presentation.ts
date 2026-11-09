import type { Step } from '../../../shared/models/step.model';
import type { StatusPresentation } from '../models/status-presentation.model';
import type { ValidationStatus } from '../models/validation-status.model';
export const PAYMENT_STEPS: readonly Step[] = [
  { id: 'form', label: 'Dane płatności' },
  { id: 'review', label: 'Weryfikacja' },
  { id: 'result', label: 'Wynik przetwarzania' },
];
export const STATUS_PRESENTATION: Record<ValidationStatus, StatusPresentation> = {
  PENDING: {
    label: 'W trakcie',
    tone: 'warning',
    eyebrow: 'ZLECENIE PRZYJĘTE',
    title: 'Trwa weryfikacja płatności',
    description: 'System sprawdza dane nadawcy oraz poszczególnych odbiorców.',
    symbol: '◷',
  },
  OK: {
    label: 'Poprawna',
    tone: 'success',
    eyebrow: 'KONTROLA ZAKOŃCZONA',
    title: 'Płatność przeszła walidację',
    description: 'Wszystkie kontrole płatności i transakcji zakończyły się poprawnie.',
    symbol: '✓',
  },
  NOT_OK: {
    label: 'Odrzucona',
    tone: 'danger',
    eyebrow: 'PŁATNOŚĆ ODRZUCONA',
    title: 'Płatność została odrzucona',
    description: 'Co najmniej jedna kontrola wykryła niepoprawne dane. Sprawdź wyniki poniżej.',
    symbol: '!',
  },
};
