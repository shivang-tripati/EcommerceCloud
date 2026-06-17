## Quick orientation for AI coding agents

This repo is a Next.js (App Router) TypeScript admin dashboard for an e-commerce product.
Keep responses focused, concrete, and tied to the project structure below.

High-level facts
- Next.js (app/) with App Router. Entry points and pages live under `app/` (see `app/(dashboard)/[storeId]` and `app/(auth)`).
- API routes are implemented under `app/api/` (e.g. `app/api/[storeId]/products/route.ts`).
- Prisma is used for DB access. Schema: `prisma/schema.prisma`. Prisma client is created in `lib/prismadb.ts` and `package.json` runs `prisma generate` on postinstall.
- Auth: Clerk (`@clerk/nextjs`) is used; see `app/(auth)` and middleware patterns.
- File uploads: Cloudinary via `next-cloudinary` and frontend helpers (look in `components/image-upload.tsx`).
- Payments and webhooks: Stripe integration exists in `lib/stripe.ts` and `app/api/webhook/route.ts`.

Developer workflows (commands you can use / expose to users)
- Dev server: `npm run dev` (runs `next dev`) — app uses port 3000 by default.
- Build: `npm run build` (runs `next build`) then `npm run start` for production (`next start`).
- Lint: `npm run lint`.
- Postinstall: `npm run postinstall` runs `prisma generate` (so CI and local installs will generate the Prisma client).

Project-specific conventions and patterns
- App Router layout grouping: UI is organized into folders like `app/(dashboard)/[storeId]/...` where `layout.tsx` files scope nested routes and providers.
- Route & API naming: For store-scoped API routes and pages, use the `[storeId]` folder pattern (mirrored under `app/` and `app/api/`).
- Components: UI primitives live at `components/ui/*`. Modals are in `components/modals/`. Prefer reusing those primitives.
- Data access: Use server components / server functions for DB calls via `lib/prismadb.ts` and return JSON from `app/api/*/route.ts`. Look at `actions/` for helper server utilities like `get-total-revenue.ts`.
- Client vs Server: Follow Next.js app-router rules — add "use client" at the top of files that use React hooks or browser-only APIs.

Integration points (what to check before edits)
- Environment variables: the repo expects several env vars (DATABASE_URL, STRIPE_API_KEY, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, etc.). Check `.env` at the repo root.
- Prisma: If you change the schema, run `npx prisma generate` and create migrations as appropriate. `package.json` already runs `prisma generate` on install but migrations are not automatic.
- Clerk: Auth-protected routes use Clerk; check middleware or `app/(auth)` before modifying auth flows.
- Cloudinary / Images: `next.config.mjs` allows images from `res.cloudinary.com` — update this config if changing remote image hosts.

Concrete examples to reference
- Add a store API: create `app/api/[storeId]/products/route.ts` — follow existing patterns in `app/api/[storeId]/categories/route.ts`.
- Reuse DB client: import from `lib/prismadb.ts` instead of creating a new PrismaClient.
- Add a dashboard page: add a folder under `app/(dashboard)/[storeId]/routes/` and export a default React component and optional `layout.tsx`.

When editing or adding features, check these files first
- `package.json` — scripts and important deps (Next 14, Prisma, Clerk, Stripe)
- `prisma/schema.prisma` — ensure DB model compatibility
- `lib/prismadb.ts` — Prisma client singleton pattern
- `lib/stripe.ts` and `app/api/webhook/route.ts` — Stripe usage and webhook handling
- `components/ui/*` and `components/modals/*` — reuse UI primitives
- `app/(dashboard)/[storeId]/layout.tsx` and `app/(auth)/layout.tsx` — route/layout patterns

Style & PR guidance for generated changes
- Keep changes minimal and localized. Follow existing component patterns (props, composition, and helper utilities in `lib/utils.ts`).
- Prefer adding unit-like tests or small runtime checks for new server routes where possible (lightweight smoke checks). If a change touches DB schema, note migration needs in the PR description.

If uncertain, ask the developer for:
- Database access to run migrations or a dev connection string.
- Expected behavior for Clerk/Stripe flows (test keys vs production keys).

End of instructions — ask me if you want this merged with any existing `.github/copilot-instructions.md` content or want the file expanded with examples/snippets.
