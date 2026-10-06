# Bushaashe Garuwa

pnpm workspace with two parts: `frontend/` (React + Vite + Tailwind CSS website, originally from Figma Make) and `backend/` (Node.js + Express API). See `README.md` for the full layout and commands.

## Development Server

Run commands from the repository root. `pnpm dev` starts the website's Vite server on `$PORT` (default 8443); `pnpm dev:api` starts the API on port 4000; `pnpm dev:all` starts both. Vite forwards `/api` to the API.

- Hot reload: Changes to source files are reflected immediately

## Project Structure

Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

### Website (`frontend/`)

- `frontend/src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `frontend/src/App.tsx` - Routes and page shell; the usual starting point for UI work
- `frontend/src/pages/` - One component per page; `src/components/` holds shared pieces
- `frontend/src/i18n/` - English, Amharic and Wolaytta text. `dictionaries/en.ts` is the base and `am.ts` must match it key for key. Wolaytta is translated by hand in one file per page under `dictionaries/wol/` (`wol.ts` only joins them): after adding or changing keys in `en.ts`, run `pnpm wolaytta:sync` to bring those files up to date (written Wolaytta is kept) and never fill them with English; `pnpm wolaytta` shows progress and mistakes. Guide for the translator: `docs/WOLAYTTA-TRANSLATION.md`
- `frontend/src/lib/api.ts` - Client for the backend; forms send only when `VITE_API_URL` is set
- `frontend/src/admin/` - Staff area at `/admin`, lazy-loaded and outside the public layout: `api/` (client and types), `auth/` (sign-in session), `components/` (Sidebar, icons, PhotoForm, ui), `content/editableFields.ts` (which texts staff may edit), `media/` (shrinking a photo before upload, the photo library hook), `views/` (SignIn, Dashboard, Visits, Bookings, Messages, Events, Gallery, Hero, Content); English only
- `frontend/src/components/PageTransition.tsx` - Fade between pages; gives each page its scroll effects from `lib/pageEffects.ts` (content rises into view; mark pieces with `data-reveal` to control the grouping). Both load after first paint; `lib/motion.tsx` holds the smooth scroll
- `frontend/src/three/` - 3D scenes (React Three Fiber), fetched only where used: `device.ts` (can this device draw 3D? otherwise photographs; `?3d=none|low|high` forces it), `land.ts` (the shape of the drawn land), `LandscapeScene.tsx` + `LandscapeHero.tsx` (home page opening as a scroll journey; under review at the unlinked `/preview/hero`), `PlaceholderHouse.tsx` (stand-in until a scanned model exists); `Frame3D.tsx` (mounts a scene only near the screen), `Markers.tsx` (page buttons placed over a scene), `Dialog.tsx` (full-screen viewer); `house/` (house to walk around, with markers), `tour/` (360° viewer; add photos in `tour/scenes.ts`), `museum/` (collection walked past by scrolling), `map/` (map of the grounds; true positions go in `map/points.ts`). These are under review at the unlinked `/preview` pages (`pages/Preview.tsx`)
- `frontend/src/pages/Vip.tsx` - VIP Service (`/vip`): private rooms for a family, a service of its own. `pages/Stay.tsx` is the Guest House (`/stay`), which is NOT open yet: it only says "Coming soon" and takes no bookings. `components/StayInquiry.tsx` is the stay request form kept for when it opens (sent as a visit request marked `guesthouse`). `ContactButtons.tsx` (call, WhatsApp, Telegram), `StickyBook.tsx` (small "Book Your Stay" on phones), `Testimonials.tsx` (hidden until `lib/testimonials.ts` has real words)
- `frontend/src/lib/content.ts` - Staff text edits laid over the built-in dictionaries; `lib/events.ts` - events and bookings from the API, with the built-in schedule as fallback; `lib/media.ts` - photos staff added (gallery photos and the pages' opening photos), with the built-in photos as fallback; `lib/heroSlots.ts` - each page's built-in opening photo
- `frontend/src/assets/photos.ts` - Photo registry; originals live in `frontend/photos-originals/`, optimized with `pnpm photos` into WebP in three sizes; `picture(src)` gives an `<img>` the right one for each screen (`<img {...picture(photos.gate)} />`)
- `frontend/src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `frontend/index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `frontend/vite.config.ts` - Vite configuration with React, Tailwind CSS v4, Figma Make plugins, the `@` alias for `src` and the `/api` dev proxy; reads `../.figma/make/site.json`

### API (`backend/`)

- `backend/src/app.ts` - Express app: middleware and route mounting
- `backend/src/container.ts` - Composition root: repositories, services and route guards
- `backend/src/http/` - Plumbing shared by modules: validate, error-handler, rate-limit, require-admin, guards, pagination, respond
- `backend/src/modules/<feature>/` - `*.schema.ts` (zod), `*.repository.ts` (SQL), `*.service.ts` (rules), `*.routes.ts` (endpoints)
- `backend/src/db/migrations.ts` - Append-only list of database changes (PostgreSQL); `db/database.ts` connects, `db/sql.ts` holds shared SQL
- Modules: `contact`, `visits`, `content` (edited website text), `events` (events and bookings), `media` (photos staff add, stored in the database), `staff` (accounts, passwords, sign-in sessions), `admin` (login, session and counts), `health`
- `backend/test/` - API tests (`pnpm test`)

### Root

- `package.json` / `pnpm-workspace.yaml` - Workspace scripts and members
- `vercel.json` - Builds and deploys the website from `frontend/`
- One app for both, without Docker: the host (AletCloud) runs `pnpm build` then `pnpm start`; the API serves the website built beside it (`backend/src/http/website.ts`). Do not add a `Dockerfile`
- **The built website (`frontend/dist`) is committed.** Building it needs over 500 MB of memory, more than the host's builder has, so host builds were failing. After ANY change under `frontend/` (or to `pnpm-lock.yaml` / `.figma/make/site.json`), run `pnpm web:prebuild` and commit `frontend/dist` with the change; `pnpm web:check` says whether it is up to date. On the host, `pnpm build` (`scripts/build.mjs`) uses the committed copy when its stamp matches the source and only builds the small API
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Website: React 19, React Router 7, Lenis (smooth scroll), GSAP + ScrollTrigger (scroll effects), Motion (page transitions), anime.js (the home page name rising letter by letter in `components/HeroName.tsx`; rows and grids marked `data-wave` arriving in a wave, in `lib/pageEffects.ts`), three + React Three Fiber + drei (3D scenes), Tailwind CSS v4 (`@tailwindcss/vite`), Vite 8, TypeScript 5.7, oxfmt
- API: Express 5, zod 4, helmet, cors, compression, PostgreSQL (`pg`; an embedded PGlite in development and tests), tsx for development

## Styling

The website uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `frontend/vite.config.ts`. `frontend/src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `frontend/src/index.css`. No Tailwind config file or PostCSS config is needed.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.
