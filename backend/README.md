# Bushaashe Garuwa API

Receives the website's forms and keeps them for the staff.
Node.js 22.13+, Express 5, TypeScript, zod for validation, and Node's built-in SQLite (no database server to install).

## Structure

```
src/
├── server.ts              Starts the API, shuts down cleanly
├── app.ts                 Builds the Express app: security, CORS, routes, errors
├── container.ts           Composition root: builds repositories, services and guards
├── config/env.ts          Settings from environment variables, checked at start-up
├── db/
│   ├── database.ts        Opens SQLite and applies migrations
│   └── migrations.ts      Database changes, in order
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

Staff endpoints need the header `Authorization: Bearer <ADMIN_API_KEY>`.
The staff pages of the website (`/admin`) use exactly these endpoints.

Example:

```bash
curl -H "Authorization: Bearer $ADMIN_API_KEY" "http://localhost:4000/api/v1/visits?upcoming=true"
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

## Protection

- Every field is validated; invalid requests get a 400 with the fields to fix.
- Form posts are limited per visitor (`FORM_RATE_LIMIT` per 15 minutes).
- A hidden form field catches spam bots; their posts are accepted but not saved.
- Security headers (helmet), CORS limited to `CORS_ORIGINS`, 32 KB body limit.

## Running

```bash
cp .env.example .env     # then fill in ADMIN_API_KEY
pnpm dev                 # from this folder, or `pnpm dev:api` from the root
pnpm test
pnpm build && pnpm start # production
```

The database file is created at `DATABASE_PATH` (default `./data/bushaashe.db`) and is not committed to Git.
On a host, put it on a persistent disk and back it up.
