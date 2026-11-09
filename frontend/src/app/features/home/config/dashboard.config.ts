import type { DashboardMetric } from '../models/dashboard-metric.model';
export const DASHBOARD_MESSAGES = {
  unavailable: 'Nie udało się pobrać danych pulpitu. Sprawdź połączenie i spróbuj ponownie.',
} as const;
export const DASHBOARD_RECENT_LIMIT = 5;
export const DASHBOARD_METRICS: readonly DashboardMetric[] = [
  {
    key: 'total',
    label: 'Wszystkie zlecenia',
    description: 'Łącznie zapisane w systemie',
    tone: 'neutral',
  },
  {
    key: 'pending',
    label: 'W trakcie przetwarzania',
    description: 'Oczekują na wyniki kontroli',
    tone: 'warning',
  },
  {
    key: 'accepted',
    label: 'Poprawne zlecenia',
    description: 'Wszystkie kontrole zakończone pozytywnie',
    tone: 'success',
  },
  {
    key: 'rejected',
    label: 'Odrzucone zlecenia',
    description: 'Wymagają sprawdzenia wyników kontroli',
    tone: 'danger',
  },
];
