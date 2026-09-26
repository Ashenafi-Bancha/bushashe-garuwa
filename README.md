# Bushaashe Garuwa

Website and API for **Bushaashe Garuwa**, a living Wolaita heritage and eco-tourism destination in Damot Sore Woreda, Wolaita Zone, Ethiopia.

```
bushaashe-garuwa/
├── frontend/              The website (React 19, Vite, Tailwind CSS 4)
│   ├── src/
│   │   ├── pages/         One file per page (Home, About, Heritage, Visit, …)
│   │   ├── components/    Shared pieces (Navbar, Footer, PageHero, …)
│   │   ├── i18n/          Languages: English, Amharic, Wolaytta (dictionaries/)
│   │   ├── admin/         Staff area at /admin (sign-in, dashboard, lists)
│   │   ├── lib/           Motion helpers and the API client (api.ts)
│   │   └── assets/        Logo and the optimized photos (photos.ts is the registry)
│   ├── photos-originals/  Full-size original photos, sorted by section
│   ├── scripts/           optimize-photos.py (pnpm photos)
│   └── public/            Favicon and icons
├── backend/               The API (Node.js, Express, TypeScript, SQLite)
│   ├── src/
│   │   ├── modules/       One folder per feature: contact, visits, admin, health
│   │   ├── container.ts   Composition root: repositories, services, guards
│   │   ├── http/          Validation, errors, rate limit, staff key, responses
│   │   ├── db/            Database connection and migrations
│   │   ├── config/        Environment settings
│   │   └── lib/           Logger
│   └── test/              API tests
├── .figma/make/           Figma Make settings (site title, description, icons)
├── package.json           Workspace scripts (below)
└── vercel.json            Website deployment
```

## Requirements

- Node.js 22.13 or newer (the backend uses Node's built-in SQLite)
- pnpm
- Python 3 with Pillow, only for `pnpm photos`

## Commands (run from this folder)

| Command | What it does |
| --- | --- |
| `pnpm install` | Install everything for both parts |
| `pnpm dev` | Website only, at http://localhost:8443 |
| `pnpm dev:api` | API only, at http://localhost:4000 |
| `pnpm dev:all` | Website and API together |
| `pnpm build` | Build the website into `frontend/dist` |
| `pnpm build:api` / `pnpm start:api` | Build and run the API for production |
| `pnpm typecheck` | Check the TypeScript in both parts |
| `pnpm test` | Run the API tests |
| `pnpm photos` | Optimize new photos from `frontend/photos-originals` |
| `pnpm video` | Make the web copy of the hero film from `frontend/media-originals/video` (needs ffmpeg) |

## Photos and film

`CONTENT-PLAN.md` lists every photo and film the website is waiting for, folder by folder,
with how each should be taken. Where a photo is missing the page shows a woven green panel
naming what belongs there, so nothing looks broken while you wait for the photographer.

## Connecting the website forms to the API

The Contact and Plan Your Visit forms send to the API when `VITE_API_URL` is set
(see `frontend/.env.example`). Without it, they only show the thank-you message.

For local development:

1. `cp backend/.env.example backend/.env`
2. Create `frontend/.env.local` with `VITE_API_URL=/api`
3. `pnpm dev:all`

## Staff area (/admin)

Open http://localhost:8443/admin and sign in with the `ADMIN_API_KEY` from `backend/.env`.
The key is kept only until the browser window closes.

From there staff can:

- **Visit requests** and **Messages**: read them and mark each one new, in progress, done or archived.
- **Events**: add the cultural food evenings and other events, with the date, time, partner
  (for example Lidya Cultural Food), photo and words in all three languages. Each event can be
  published, shown on the home page, and opened for bookings.
- **Event bookings**: see who reserved a place, for how many guests, with the booking number.
  Each one moves from "to call" to confirmed, came, or cancelled. Cancelling frees the places again.
  Events can have a limit, and the website counts down the places left and stops when it is full.
- **Website text**: change headings, paragraphs, opening hours and contact details, per page and
  per language. An empty box puts the built-in words back.

The public website always has its own built-in text and falls back to it, so the pages stay
correct even when the API is offline. Edits and events appear within a minute.

## Deployment

- **Website:** Vercel builds it from GitHub using `vercel.json` (builds `frontend/`, publishes `frontend/dist`).
- **API:** needs a Node.js host with a persistent disk for the SQLite file (for example Render, Railway, Fly.io or a VPS). See `backend/README.md`.
  Then set `VITE_API_URL` in Vercel to the API's public address and `CORS_ORIGINS` on the API to the website's address.
