# Payment processing — hosted demo

Samodzielna, uproszczona hosted demo version systemu payment processing. Jeden kontener: Angular + Spring Boot, jeden proces Java, jeden origin. Repozytorium nie wymaga dostępu do pozostałych repozytoriów, GitHub Packages ani prywatnych zależności.

## Full architecture vs hosted demo

| Obszar | Pełna architektura | Hosted demo |
| --- | --- | --- |
| Backend | Osobne microservices | Jeden Spring Boot |
| Komunikacja | Kafka | Synchroniczne wywołania lokalne |
| Kontrakty | Avro + Schema Registry | JSON i lokalne rekordy Java |
| Dane | PostgreSQL | ConcurrentHashMap |
| Frontend | Angular | Mały Angular serwowany przez Spring Boot |
| Hosting | Wiele usług i infrastruktura | Jeden kontener Java |

Kafka, Avro, Schema Registry, PostgreSQL oraz podział na mikroserwisy zostały usunięte wyłącznie w celu ograniczenia kosztów hostingu. Demo pokazuje zgodną logikę walidacji i agregacji statusów, ale nie demonstruje asynchroniczności, trwałości ani odporności infrastruktury pełnej wersji. Nie wykonuje rzeczywistych przelewów.

Dane są współdzielone między użytkownikami instancji, przechowywane wyłącznie w pamięci i znikają po restarcie lub ponownym wdrożeniu. Brak logowania, izolacji użytkowników i trwałej bazy. Używaj wyłącznie fikcyjnych danych. Historia nie ma paginacji ani automatycznej retencji: to małe demo, nie system produkcyjny.

## Logika i format

Przykłady: `examples/payment-ok.json` i `examples/payment-not-ok.json`.

1. Upload przyjmuje multipart/form-data, pole `file`, maksymalnie 1 MB.
2. Basic validation: poprawny JSON, wymagane obiekty i kwoty, waluta, zgodność `transactionCount` z długością listy i `totalAmount` z sumą kwot. Błąd oznacza HTTP 400 i nie tworzy wpisu w historii.
3. Payment validation: niepuste debtor name, numer konta długości 28, od 1 do 5 transakcji (zgodnie z checkerem pełnej wersji).
4. Transaction validation: niepuste creditor name, numer konta długości 28, amount > 5. Wszystkie transakcje są sprawdzane, także gdy payment validation jest NOT_OK.
5. Final status: OK tylko gdy payment validation i wszystkie transaction validations mają OK; w pozostałych przypadkach NOT_OK. Zapis kompletnego, niemutowalnego wyniku w ConcurrentHashMap.

Kwoty używają BigDecimal. Wersja demo sprawdza wskazaną regułę długości konta, nie poprawność IBAN. Niepoprawne lub brakujące nazwy i numery kont powodują NOT_OK. Kwoty <= 5 (również zero i ujemne) dają NOT_OK transakcji. To świadoma prezentacja reguły transaction checker; pełny upload odrzuca kwoty <= 0 już w basic validation.

Statusy kontraktu: PENDING, OK, NOT_OK. Ponieważ demo przetwarza synchronicznie, nie publikuje przejściowego PENDING — odpowiedź na upload ma wynik końcowy. Błąd walidacji biznesowej daje HTTP 201 i NOT_OK; błąd pliku daje 400, za duży plik 413, nieznany identyfikator 404.

## API

| Metoda | Ścieżka | Wynik |
| --- | --- | --- |
| POST | `/api/payments/upload` | 201, kompletny wynik i `paymentId` |
| GET | `/api/payment-status/{id}` | `paymentId`, `status` |
| GET | `/api/payments/history` | Tablica wyników, najnowsze najpierw |
| GET | `/api/payments/{id}` | Płatność, walidacje i przyczyny |
| GET | `/api/health` | `{"status":"UP"}` |

Frontend korzysta wyłącznie z relative API URLs. Historia jest uproszczoną tablicą zamiast paginowanej odpowiedzi pełnego systemu. Fallback SPA obsługuje `/`, `/payments/history`, `/payments/{id}`. Ścieżki API nie są przekierowywane do HTML.

## Lokalne uruchomienie

Wymagane Java 21 i Node 22 (>=22.22.3), npm. Maven dostarcza wrapper.

Terminal 1:

```sh
cd backend
./mvnw test
./mvnw spring-boot:run
```

Terminal 2:

```sh
cd frontend
nvm use # jeśli używasz nvm
npm ci
npm test -- --watch=false
npm start
```

Otwórz http://localhost:4200. Dev server przekazuje `/api` do portu 8080, więc nie jest potrzebny CORS. Przy zmianie portu backendu zmień lokalny `frontend/proxy.conf.json`.

### Jeden lokalny JAR z frontendem

Z katalogu root (polecenia dla macOS/Linux):

```sh
(cd frontend && npm ci && npm run build)
mkdir -p backend/src/main/resources/static
cp -R frontend/dist/demo/browser/. backend/src/main/resources/static/
(cd backend && ./mvnw verify)
java -jar backend/target/app.jar
```

Otwórz http://localhost:8080. Wygenerowane statyczne pliki są ignorowane przez git.

### Docker

```sh
docker build -t payment-processing-demo .
docker run --rm --name payment-demo -p 8080:8080 -e PORT=8080 payment-processing-demo
```

Multi-stage build: Node 22 buduje Angulara, JDK 21 buduje i testuje backend z plikami frontendu, finalny obraz zawiera JRE 21 i jeden JAR. Proces działa jako użytkownik bez uprawnień roota. Bez nginx. JVM ogranicza procent pamięci stosu Java; całkowita pamięć procesu jest większa niż heap.

### Smoke test

```sh
curl -f http://localhost:8080/api/health
curl -f -F file=@examples/payment-ok.json http://localhost:8080/api/payments/upload
# Skopiuj paymentId z odpowiedzi:
ID='<paymentId>'
curl -f "http://localhost:8080/api/payment-status/$ID"
curl -f "http://localhost:8080/api/payments/$ID"
curl -f http://localhost:8080/api/payments/history
curl -f http://localhost:8080/payments/history
curl -f "http://localhost:8080/payments/$ID"
curl -f -F file=@examples/payment-not-ok.json http://localhost:8080/api/payments/upload
```

## Railway

1. Wypchnij **to samodzielne repozytorium** na GitHub i utwórz Railway service z tego repozytorium. Root directory pozostaw na root repo demo.
2. Railway powinien wykryć root `Dockerfile`; w razie potrzeby wskaż go w ustawieniach builda. Nie dodawaj usług PostgreSQL ani Kafka i nie montuj volume.
3. Skonfiguruj health check `/api/health`, a następnie wygeneruj publiczną domenę w Networking.
4. Railway przekazuje `PORT`; Spring Boot używa `server.port=${PORT:8080}`. Nie hardkoduj domeny ani portu we frontendzie.
5. Sprawdź upload i bezpośrednie otwarcie `/payments/history` oraz `/payments/{id}` na wygenerowanej domenie.

Jedna replika: pamięć nie jest współdzielona między instancjami. Restart usuwa historię. Projekt minimalizuje liczbę usług, ale nie gwarantuje darmowego hostingu — dostępny plan i limity sprawdź w koncie Railway. Repozytorium nie zawiera sekretów ani danych dostępowych.

## Testy

Backend: poprawna płatność, walidacja dłużnika i wierzyciela, limit transakcji, granice kwoty, błędny JSON, spójność sumy i liczby, upload/status/history/details, nieznane ID i fallback SPA. Frontend: multipart upload i odczyt statusu/historii/szczegółów oraz błędy HTTP, w runnerze Vitest dostarczonym przez Angular CLI ([dokumentacja](https://angular.dev/guide/testing)).

### Wynik lokalnej weryfikacji (2026-11-09)

- Java 21.0.12, Node 22.23.3.
- `./mvnw test`: 17 testów, 0 błędów; `./mvnw verify` i finalne `package`: BUILD SUCCESS.
- `npm ci`: OK; `npm test -- --watch=false`: 4 testy OK; `npm run build`: OK (ok. 256 kB plików początkowych, ok. 71 kB transferu).
- JAR z frontendem: lokalny curl na porcie ustawionym przez `PORT=18080`: health, upload OK i NOT_OK, status, details, history i trzy ścieżki SPA — OK. Proces testowy zatrzymano po weryfikacji.
- `docker build -t payment-processing-demo .`: nie wykonano builda obrazu z powodu niedziałającego demona Docker (brak socketu). Uruchomienie kontenera pozostaje do sprawdzenia po włączeniu Docker.
