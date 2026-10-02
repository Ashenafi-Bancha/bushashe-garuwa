# Bushaashe Garuwa API

Receives the website's forms and keeps them for the staff.
Node.js 22+, Express 5, TypeScript, zod for validation, and PostgreSQL. On a developer's computer an embedded
PostgreSQL runs inside the API, so there is no database server to install.

## Structure

```
src/
├── server.ts              Starts the API, shuts down cleanly
├── app.ts                 Builds the Express app: security, CORS, routes, errors
├── container.ts           Composition root: builds repositories, services and guards
├── config/env.ts          Settings from environment variables, checked at start-up
├── db/
│   ├── database.ts        Connects to PostgreSQL and applies migrations
│   ├── migrations.ts      Database changes, in order
│   └── sql.ts             Shared SQL pieces ("today" in Ethiopia)
├── http/                  Plumbing shared by every module: validate, error-handler,
│                          rate-limit, require-admin, guards, pagination, respond
├── lib/                   logger
└── modules/               One folder per feature, each in four layers:
    ├── contact/           *.schema.ts      what a request may contain (zod)
    ├── visits/            *.repository.ts  all SQL for the feature
    ├── content/           *.service.ts     the feature's rules
    ├── events/            *.routes.ts      the HTTP endpoints
    ├── admin/             (events also holds bookings: booking.*.ts)
    ├── health/
    └── shared/            schemas and helpers used by several modules
```

Requests flow `routes → service → repository → database`. To add a feature
(for example room bookings), copy the `visits` folder, add a migration and
mount the routes in `app.ts`.

## Endpoints

All responses are JSON: `{ "data": … }` on success, `{ "error": { "code", "message", "details" } }` on failure.

| Method | Path | Who | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | anyone | Status check |
| POST | `/api/v1/contact` | website | Contact page form |
| POST | `/api/v1/visits` | website | Plan Your Visit form |
| GET | `/api/v1/contact?page=1&pageSize=20` | staff | List messages |
| GET | `/api/v1/visits?upcoming=true` | staff | List visit requests |
| PATCH | `/api/v1/contact/:id/status` | staff | `{ "status": "new" \| "in_progress" \| "done" \| "archived" }` |
| PATCH | `/api/v1/visits/:id/status` | staff | Same statuses |
| GET | `/api/v1/admin/session` | staff | Checks the key (used by the sign-in box) |
| GET | `/api/v1/admin/summary` | staff | Counts for the dashboard cards |
| GET | `/api/v1/content?lang=en` | website | Text edited by staff, as `{ key: value }` |
| GET/PUT | `/api/v1/content/admin` | staff | Read and save edited text (empty value undoes one) |
| GET | `/api/v1/events` | website | Published events still to come |
| GET/POST | `/api/v1/events/admin` | staff | List every event, add one |
| PUT/DELETE | `/api/v1/events/admin/:id` | staff | Change or remove an event |
| POST | `/api/v1/events/:id/bookings` | website | Reserve places (answers with a booking reference) |
| GET | `/api/v1/events/admin/bookings` | staff | Bookings, newest first (`?eventId`) |
| PATCH | `/api/v1/events/admin/bookings/:id/status` | staff | Handle a booking |
| GET | `/api/v1/media` | website | Photos staff added: `gallery`, and `heroes` page by page |
| GET | `/api/v1/media/:id/image` | website | The photograph itself |
| GET | `/api/v1/media/admin` | staff | Every photo, hidden ones too |
| POST | `/api/v1/media/admin/images` | staff | Add a photo: the body is the JPEG, PNG or WebP file (`?kind=gallery&category=` or `?kind=hero&slot=`) |
| PUT/DELETE | `/api/v1/media/admin/:id` | staff | Save its heading, description and whether it shows; or remove it |

### Staff sign-in

Staff sign in with an email and a password:

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/v1/admin/login` | `{ email, password }` in; `{ token, expiresAt, user }` out |
| POST | `/api/v1/admin/logout` | Ends the session |
| GET | `/api/v1/admin/session` | Who is signed in |

Every staff endpoint then needs the header `Authorization: Bearer <token>`. A session lasts
12 hours. The staff pages of the website (`/admin`) use exactly these endpoints.

The account comes from the settings `ADMIN_EMAIL` and `ADMIN_PASSWORD`: when the API starts it
creates that account, and if the password setting was changed it gives the account the new
password and signs it out everywhere. Passwords are stored only as a salted scrypt hash, and
only a hash of each session token is kept. Sign-in is limited to 10 tries per visitor per
15 minutes.

Example:

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/admin/login \
  -H "content-type: application/json" \
  -d '{"email":"you@example.com","password":"your password"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).data.token")
curl -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/v1/visits?upcoming=true"
```

## How bookings work

- An event may have a **capacity**. The API works out the places left from the bookings
  that still hold a place, and sends it to the website with every event.
- A booking is refused with 409 when the event is full (`event_full`) or when the guest
  asked for more places than are left (`not_enough_places`, which also says how many are left).
- Each booking gets a short **reference** such as `BG-7K3Q`, which the guest can quote on the phone.
- A second request **from the same phone number for the same event within 24 hours** returns the
  booking already made instead of creating another, so a double tap never books twice.
  Numbers written differently (`0911…` and `+251911…`) count as the same person.
- A booking moves **pending → confirmed → attended**, or is **cancelled**. Cancelling gives the
  places back to the event straight away; the booking itself is kept for the record.
- Bookings are refused for events that are unpublished, past, or not open for bookings.

## Emails

The API sends branded emails in the guest's language (English or Amharic; Wolaytta
falls back to English), plus a notice to the staff inbox:

| When | Guest (if they gave an email) | Staff (`STAFF_EMAIL`) |
| --- | --- | --- |
| A place is booked at an event | Booking number and details | New booking |
| Staff set a booking to *confirmed* (once) | Confirmation with directions | |
| A visit request arrives | Acknowledgement | New visit request |
| A contact message arrives | Acknowledgement with their words | New message |

- The design lives in `src/modules/notifications/templates/`: `layout.ts` is the shared
  frame (white card on black, logo, gold line, green button, address), `messages.ts` the words.
- Sending happens in the background: a mail problem is logged and never undoes a booking.
- Without `SMTP_HOST`, every email is saved as an .html file in `MAIL_OUTBOX` instead of
  being sent, which is handy while developing.
- `pnpm email:preview` writes every email, filled with sample details, to
  `data/email-previews/` so the designs can be checked in a browser.
- For `info@bushaashegaruwa.com`, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` and `SMTP_PASS`
  to the values from the mail provider (Google Workspace, Zoho, or the hosting company).

## Protection

- Every field is validated; invalid requests get a 400 with the fields to fix.
- Form posts are limited per visitor (`FORM_RATE_LIMIT` per 15 minutes).
- A hidden form field catches spam bots; their posts are accepted but not saved.
- Security headers (helmet), CORS limited to `CORS_ORIGINS`, 32 KB body limit.

## Running

```bash
cp .env.example .env     # then fill in ADMIN_EMAIL and ADMIN_PASSWORD
pnpm dev                 # from this folder, or `pnpm dev:api` from the root
pnpm test
pnpm build && pnpm start # production
```

## Database

PostgreSQL. The tables are created and kept up to date automatically when the API starts
(`src/db/migrations.ts`).

- **On a host:** set `DATABASE_URL` to the database's address (and `DATABASE_SSL` if the
  provider asks for an encrypted connection). With `NODE_ENV=production` the API refuses to
  start without it.
- **On your computer:** leave `DATABASE_URL` empty. An embedded PostgreSQL keeps its files in
  `DEV_DATABASE_DIR` (default `./data/pgdata`, not committed to Git).
- **Tests:** `pnpm test` uses an in-memory PostgreSQL. To run them against a real server, give
  an account that may create databases; each test file makes its own and removes it afterwards:

  ```bash
  TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres pnpm test
  ```

Dates such as "today" and "handled today" follow the day in Ethiopia (Africa/Addis_Ababa),
wherever the server runs.
