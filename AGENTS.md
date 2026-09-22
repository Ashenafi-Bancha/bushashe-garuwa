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
- `frontend/src/i18n/` - English, Amharic and Wolaytta text (`dictionaries/en.ts`, `am.ts`, `wal.ts`); every key added to `en.ts` must also go into `am.ts` and `wal.ts`
- `frontend/src/lib/api.ts` - Client for the backend; forms send only when `VITE_API_URL` is set
- `frontend/src/assets/photos.ts` - Photo registry; originals live in `frontend/photos-originals/`, optimized with `pnpm photos`
- `frontend/src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `frontend/index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `frontend/vite.config.ts` - Vite configuration with React, Tailwind CSS v4, Figma Make plugins, the `@` alias for `src` and the `/api` dev proxy; reads `../.figma/make/site.json`

### API (`backend/`)

- `backend/src/app.ts` - Express app: middleware and route mounting
- `backend/src/modules/<feature>/` - `*.schema.ts` (zod), `*.repository.ts` (SQL), `*.service.ts` (rules), `*.routes.ts` (endpoints)
- `backend/src/db/migrations.ts` - Append-only list of database changes
- `backend/test/` - API tests (`pnpm test`)

### Root

- `package.json` / `pnpm-workspace.yaml` - Workspace scripts and members
- `vercel.json` - Builds and deploys the website from `frontend/`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Website: React 19, React Router 7, Lenis, Tailwind CSS v4 (`@tailwindcss/vite`), Vite 8, TypeScript 5.7, oxfmt
- API: Express 5, zod 4, helmet, cors, Node's built-in `node:sqlite`, tsx for development

## Styling

The website uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `frontend/vite.config.ts`. `frontend/src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `frontend/src/index.css`. No Tailwind config file or PostCSS config is needed.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.
