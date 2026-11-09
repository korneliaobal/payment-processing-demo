export const PAYMENT_MESSAGES = {
  invalidDraft:
    'Uzupełnij wymagane pola. Wpisz poprawny polski IBAN lub NRB z prawidłową sumą kontrolną. Kwoty muszą być dodatnie i mieć maksymalnie 2 miejsca po przecinku.',
  historyUnavailable: 'Nie udało się pobrać historii z bazy. Spróbuj ponownie.',
  offline: 'Brak połączenia z serwerem. Sprawdź, czy backend jest uruchomiony.',
  uploadFailed: 'Nie udało się przyjąć zlecenia. Sprawdź dane i spróbuj ponownie.',
  statusUnavailable: 'Nie udało się pobrać statusu płatności. Spróbuj ponownie.',
  pollingTimeout:
    'Nie udało się pobrać końcowego statusu płatności w wyznaczonym czasie. Sprawdź ponownie bez wysyłania zlecenia.',
} as const;
