import type { WorkspaceView } from '../models/workspace-view.model';
import type { WorkspaceHeading } from '../models/workspace-heading.model';
export const WORKSPACE_ROUTES = { home: '/' } as const;
export const WORKSPACE_HEADINGS: Record<WorkspaceView, WorkspaceHeading> = {
  home: {
    title: 'Pulpit operatora',
    description: 'Przegląd zleceń i szybki dostęp do codziennej obsługi płatności.',
  },
  form: {
    title: 'Nowe zlecenie płatnicze',
    description: 'Przygotuj płatność, zweryfikuj dane i śledź wynik kontroli.',
  },
  review: {
    title: 'Weryfikacja zlecenia',
    description: 'Sprawdź dane przed przekazaniem płatności do przetwarzania.',
  },
  result: {
    title: 'Status zlecenia',
    description: 'Sprawdź wyniki kontroli płatności i poszczególnych transakcji.',
  },
  history: {
    title: 'Historia zleceń płatniczych',
    description: 'Przeglądaj zapisane zlecenia i sprawdzaj szczegóły ich przetwarzania.',
  },
};
