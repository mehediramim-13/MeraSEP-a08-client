<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MeraSEP: Frontend Build Prompt
You are building the COMPLETE FRONTEND of **MeraSEP**, a community-driven Social Development Events Platform (users create, join and track social service events in their local area, for example "Winter Clothes Distribution, Mirpur 10, Dhaka"). The repo is already scaffolded (Next.js App Router, TypeScript, Tailwind v4, shadcn). Work inside the existing repo.

## 0. Ground rules (read first)

1. Read `AGENTS.md` and `package.json` before writing code. This is Next.js 16 and React 19 with the React Compiler on. Your memory of older Next.js APIs may be wrong, so check the docs bundled in `node_modules/next/dist/docs` when unsure (for example `middleware` is now `proxy`, `params` and `searchParams` are Promises).
2. **Frontend only, and auth buttons are inert.** Do NOT build the backend. Do NOT implement real authentication (BetterAuth, JWT, MongoDB). I will wire those myself.
   - **Sign in, Sign up (Register), Continue with Google and Logout must NOT work.** Design them fully (hover, focus, pressed and loading visuals, field validation messages), but their submit/click handlers are empty functions marked `// TODO(mehedi):`. No session, no fake login, no redirect, no user stored in localStorage, no toast on submit.
   - **Everything else must really work** against the dummy data layer: view details, join event, create, update, delete, search, filter, sort, theme toggle, newsletter, copy link, save event, and so on. Treat the app as a finished product that just has no login yet.
   - Leave clean, clearly marked seams (section 3) so I can plug in the real API and auth quickly.
3. Existing stack, use it: `next`, `react`, Tailwind v4, shadcn (style `base-maia`, built on `@base-ui/react`, icon library `hugeicons`, `lucide-react` also installed), `next-themes`, `sonner`, `react-hook-form` + `zod` + `@hookform/resolvers`, `date-fns`, `react-day-picker`.
   - Install anything else you need. At minimum install `motion` (the Framer Motion successor) for animation.
   - Add shadcn components with `npx shadcn@latest add <name>`. Do not hand-write what shadcn already provides.
4. Do NOT run `git commit`, `git push` or change git config. I will commit myself after every phase. So work in the phases of section 9 and stop with a short summary after each.
5. No Lorem ipsum anywhere. Write real, believable copy and realistic Bangladeshi data (Dhaka, Chattogram, Sylhet, Rajshahi, Khulna and so on). Never use `alert()`, `confirm()` or `prompt()`. Use `sonner` toasts and shadcn `AlertDialog` for destructive confirmations.
6. TypeScript strict. No `any`. Run `npm run lint` and `npm run build` at the end of every phase and fix every error and warning before moving on.

## 1. Brand and design system

**Name:** MeraSEP ("Mera" means "my", SEP = Social Events Platform). **Tagline:** "Your community. Your cause. Your move."

**Logo:** I am providing `merasep-logo.svg` (a map pin with a heart inside and an amber spark). Copy it to `public/logo/merasep-logo.svg` and also use it as the favicon (`src/app/icon.svg`). Render the wordmark as REAL HTML text next to the mark, never baked into an image, so it adapts to dark mode: "Mera" in the foreground colour and "SEP" in the primary colour, bold. Build one `<Logo />` component and reuse it in Navbar, Footer, auth pages and the loading screen so size and style stay identical everywhere.

**Palette (standard, nature and service feel).** Define as CSS variables in `src/app/globals.css` for both `:root` and `.dark`, mapped to Tailwind tokens, keeping shadcn's token names (`--background`, `--foreground`, `--primary`, `--muted`, `--card`, `--border`, `--ring` and so on):
- Primary: emerald (`#059669` light, `#34D399` dark for text and accents, `#10B981` for fills)
- Accent: amber `#F59E0B` (used sparingly: highlights, badges, spark)
- Light mode: background warm white `#FAFAF7`, cards `#FFFFFF`, text slate-900, muted text slate-600
- Dark mode: background deep green-black `#0B1210`, cards `#111B17`, borders `#1F2E28`, text near-white `#E8F1EC`
- Destructive: red-600. Keep contrast WCAG AA in both themes.

**Typography:** use `next/font/google`. Headings: "Plus Jakarta Sans" (700/800). Body: "Inter". Define ONE reusable `<SectionHeading eyebrow title subtitle />` component and use it for every section so main heading font, size and colour are identical across the whole site.

**Consistency rules (required by the assignment):**
- One button style across the site (`Button` variants from shadcn, same radius, same height, same hover). The primary CTA on the home page and every other page must look identical.
- All cards equal height and width inside a grid (`h-full`, fixed image aspect ratio such as `aspect-[16/10]`, `line-clamp` on titles and descriptions). Uniform image sizes and gaps.
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Section vertical padding `py-16 md:py-24`.
- Fully responsive at 360px, 768px and 1280px+. No horizontal scroll at any width.
- Use the new **X logo** (not the Twitter bird) in the footer social icons. Use an inline SVG of the X mark.

**Animation (this must feel premium and alive).** Use `motion`:
- Scroll-reveal for every section (fade + slight rise, staggered children), using `whileInView` with `viewport={{ once: true }}`.
- Hero: animated gradient mesh or soft floating blobs in the brand colours, floating cards or badges, an animated headline (word-by-word reveal), CTA buttons with a subtle hover lift and arrow slide.
- Animated number counters for the stats strip (count up when visible).
- Cards: hover lift, image zoom inside a clipped container, soft shadow growth.
- Navbar: becomes blurred and shadowed after scrolling; mobile menu slides in with AnimatePresence; the active link has an animated underline (`layoutId`).
- Page transitions: a light fade or slide between routes via `app/template.tsx`.
- Theme toggle: animated sun/moon icon swap.
- Infinite marquee for a partner or NGO strip, and a gallery with hover overlays.
- Respect `prefers-reduced-motion`: wrap with `MotionConfig reducedMotion="user"`.
- Keep it performant (transform and opacity only, no layout thrash).

### Design direction (make it genuinely best-in-class, not a template)
Use your own taste and go beyond a generic landing page. It should feel like a polished, modern product from a well-funded startup, warm and human because it is about community, not cold SaaS.
- Visual language: generous whitespace, large confident typography, soft layered shadows, rounded-2xl/3xl surfaces, subtle gradient borders on featured cards, tasteful glass (blur) only on navbar and floating elements, a faint noise or grain overlay and soft radial gradients behind hero and CTA sections, bento-style layouts where they fit (features, stats).
- Hero must be memorable: animated mesh gradient, floating event cards or badges with gentle parallax, a rotating highlighted word in the headline (for example "Clean up. Plant. Feed. Teach."), and an image composition with rounded masks. No flat stock layout.
- Event cards: image with a gradient scrim, floating type badge, date chip (day and month block), location row with pin icon, impact meter, hover lift. Each event type gets its own consistent colour and icon.
- Micro-interactions everywhere: button press scale, animated focus rings on inputs, floating labels or smooth label transitions, animated checkmarks on validation, shimmering skeletons, smooth accordion and dialog transitions, toast slide-ins.
- Dark mode must be designed on purpose (glow accents, deep green-black surfaces), not just inverted colours.
- Polish the details: custom scrollbar, `::selection` colour in brand green, smooth scroll, consistent icon set (pick one of hugeicons or lucide and stay with it), crisp 1px borders, consistent 4/8px spacing rhythm.

## 2. Theme

`next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, and `disableTransitionOnChange` off so the switch can animate smoothly. A `ThemeProvider` in the root layout and a `<ThemeToggle />` (light/dark, plus optional "system" in a dropdown) in the Navbar. The ENTIRE UI (including sonner toasts, calendar popover, dialogs, skeletons) must look right in both themes. Avoid hydration mismatch (mount guard in the toggle).

## 3. Seams for my backend and auth (very important)

Create these files with typed placeholders and `// TODO(mehedi):` comments, so I only need to fill in internals:

- `src/types/index.ts`: `MeraEvent` (`_id`, `title`, `description`, `eventType`, `thumbnail`, `location`, `eventDate` ISO string, `creatorEmail`, `creatorName`, `createdAt`, optional `volunteerGoal`, optional `joinedCount`), `JoinedEvent` (event data + `userEmail`, `joinedAt`), `EventType` union (`Cleanup | Plantation | Donation | Education | Health Camp | Food Distribution | Blood Donation | Flood Relief`), `AppUser` (`id`, `name`, `email`, `image`).
- `src/lib/api.ts`: all data functions, each typed and async: `getUpcomingEvents({ limit?, search?, type? })`, `getEventById(id)`, `createEvent(data)`, `getMyEvents()`, `updateEvent(id, data)`, `deleteEvent(id)`, `joinEvent(id)`, `getJoinedEvents()`, `updateProfile(data)`. **Data source must be swappable by changing ONE link.** At the top of `src/lib/api.ts` (or a small `src/lib/api-config.ts`) define `API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/mock"` and an `ENDPOINTS` object (events list, event by id, my events, joined, and so on). By default the app reads a plain static JSON file at `public/mock/events.json` (an array of 12 realistic events: 10 upcoming with dates between Nov 2026 and Mar 2027, 2 past ones to prove past events get filtered out; real-looking Bangladeshi locations, uploader names, Unsplash thumbnails, volunteer goals and joined counts). When I later paste any other JSON URL into `NEXT_PUBLIC_API_URL`, every page must load that data with NO other code change. To make that safe:
- Do all filtering, sorting, `limit`, search, "upcoming only" and "by creator" **on the client side inside the api layer**, so a dumb JSON endpoint that just returns the full list works.
- Add a small `normalizeEvent()` adapter that accepts either `_id` or `id`, an array or `{ data: [...] }` / `{ events: [...] }`, and fills safe defaults for missing optional fields, so slightly different JSON shapes do not crash the UI.
- Write actions (create, update, delete, join) update a local overlay (in-memory plus localStorage, merged on top of the fetched list) so the full UI is demonstrable without a server. Mark each one with `TODO(mehedi)` and the real endpoint and method it will call. Each function has a comment showing the real endpoint it will call and that it will send the JWT in the `Authorization` header.
- `src/lib/auth-client.ts` and `src/hooks/use-auth.ts`: a placeholder `useAuth()` returning `{ user, isLoading, login, register, loginWithGoogle, logout, updateProfile }`. `login`, `register`, `loginWithGoogle` and `logout` are empty no-ops. Put ONE constant at the top of `src/lib/auth-client.ts`, `PREVIEW_AS_LOGGED_IN = true`, that makes `useAuth()` return a hard-coded demo user (name, email, avatar) so the logged-in UI (avatar, dropdown, create/manage/joined pages, join button, creator email on events) can be seen and used. Setting it to `false` shows the logged-out UI (Login button). Mark the whole file as replaceable by BetterAuth.
- `src/components/auth/private-route.tsx`: a single wrapper that all private pages use. For now it simply renders its children (so I can design-check every private page). Keep the structure ready for the real guard: a commented `TODO(mehedi)` block describing "while `isLoading` show the full-page skeleton (a reload on a private route must never flash the login page); when not logged in redirect to `/login?redirect=<path>`".
- `.env.example` with `NEXT_PUBLIC_API_URL=` and a comment ("leave empty to use /mock, or paste a JSON endpoint").
- `next.config.ts`: `images.remotePatterns` for `images.unsplash.com`, plus allow any `https` host (users paste arbitrary thumbnail URLs). Add a graceful fallback image when a thumbnail URL fails to load (`onError`).

## 4. Pages and routes

Use the App Router. Every route needs `loading.tsx` (skeletons), and the root needs `not-found.tsx` and `error.tsx`. Reloading ANY route must never error.

### Layout
- **Navbar** (sticky): Logo, link "Upcoming Events" (also "Home"), theme toggle. If logged out: a **Login** button. If logged in: the user's avatar (shadcn Avatar, with initials fallback) and a Logout button; hovering the avatar shows a Tooltip with the display name. Clicking the avatar opens a dropdown with: Create Event, Manage Events, Joined Events, Profile. Fully usable on mobile (sheet or animated menu).
- **Footer**: eye-catching. Gradient or dark-green band, big logo, short mission text, quick links, a "Get involved" column, contact info (Dhaka address, phone, email), social icons (Facebook, X, Instagram, LinkedIn, YouTube), a wave or curved top divider, and a copyright line with the current year. Works in both themes.

### `/` Home (public)
1. **Banner/Hero**: social-service theme, animated (see section 1). Headline, supporting copy, two CTAs ("Explore Events" and "Create an Event"), a floating stats card or avatar stack ("2,400+ volunteers"), and a hero illustration or image composition (use Unsplash images of volunteers; remote images must be sized and cropped uniformly).
2. **Stats strip**: animated counters (events held, volunteers, cities, people helped).
3. **Features**: 6 feature cards with icons (create events, join in one click, track what you joined, manage your events, local focus, transparent impact). Equal-height cards.
4. **Recent Upcoming Events**: exactly 6 cards in a responsive 1/2/3 column grid, data from `getUpcomingEvents({ limit: 6 })`, sorted by soonest date, with skeleton while loading and an empty state. Include a "View all events" button.
5. **How it works**: 3 or 4 animated steps (Sign up, Find or create, Join, Make impact).
6. **Gallery**: static grid of 8 community-service photos (equal sizes, hover overlay with a caption and location).
7. **Testimonials** (optional but nice) and a **partner/NGO marquee**.
8. **Newsletter**: designed section with email input and subscribe button. No real functionality: on submit validate the email with zod and show a success toast.
9. Final CTA band.

### `/events` Upcoming Events (public)
Grid of event cards. Each card: thumbnail, title, location, event type badge, formatted date, **View Event** button. ONLY upcoming events (date >= today); past events must never appear. Extra: a search box, event-type filter chips, and sort (soonest / newest) which work client-side on the loaded data. Skeleton grid while loading, friendly empty state.

### `/events/[id]` Event details (public)
Large banner image, title, type badge, location, date and time, "created by" name, full description, a **live countdown** to the event, a volunteer-goal progress bar (extra feature, section 7), a share button (copy link with toast), and a **Join Event** button. Clicking Join works (it uses the preview user): call `joinEvent`, bump the joined count with an animation, show a success toast; if already joined, show a disabled "Joined" state. Leave a `TODO(mehedi)` for the logged-out case ("redirect to `/login?redirect=/events/<id>` with an info toast"). Handle invalid IDs with `not-found`.

### `/login`
Email and password form, "Continue with Google" button (UI only; GitHub not needed), link to Register, and show/hide password toggle. Zod validation with inline errors (visual only). The submit handler is an empty TODO: no toast, no redirect, no session. Split-screen layout on desktop (animated brand panel on one side), single column on mobile.

### `/register`
Fields: Name, Email, Photo URL, Password, plus a link to Login. **Password rules (required):** at least one uppercase letter, at least one lowercase letter, minimum 6 characters. Show a live checklist of those three rules under the field. Failures show inline errors. The submit handler is an empty TODO (no toast, no redirect, no account creation). Do NOT add email verification or forgot-password.

### `/create-event` (private)
Fields: title, description, event type (select with the types above), thumbnail image URL (with live preview), location, event date (shadcn Calendar in a Popover; **past dates disabled and also rejected by zod**; the date must be in the future). The creator's email and name come from `useAuth()` and are attached to the payload (not shown as editable). Zod + react-hook-form with inline errors. On success: toast, then redirect to `/events`.

### `/manage-events` (private)
Shows only the logged-in user's events (table on desktop, cards on mobile). Each row has **Update** (opens a Dialog or Sheet with the same validated form, prefilled) and **Delete** (AlertDialog confirmation, then success toast). Empty state with a CTA to create an event. Skeleton while loading.

### `/joined-events` (private)
Events the user joined, **sorted by event date** (soonest first), card layout, empty state with CTA to browse events.

### `/profile` (private, optional feature)
Shows avatar, name, email. A form to update **name** and **photo URL** (zod validated, live avatar preview, success toast). Calls `updateProfile`.

## 5. Validation (challenge requirement)
Zod schemas in `src/lib/validations.ts` for: login, register, create/update event, profile, newsletter. Reuse one event schema for create and update. Show field-level error text under inputs plus a toast on submit failure. Disable the submit button and show a spinner while submitting.

## 6. Loading, empty and error states
- Skeletons (shadcn `Skeleton`) shaped like the real content for: event cards grid, event details, table rows, profile, and a full-page skeleton for `PrivateRoute`.
- Friendly empty states with an icon and a CTA.
- `error.tsx` with a "Try again" button; `not-found.tsx` with an on-brand illustration and a link home.
- Toaster mounted once in the root layout with theme-aware styling and `richColors`.

## 7. Extra features (implement these, they differentiate the project)
1. **Skeleton loaders** everywhere (above).
2. **Profile view and update** (`/profile`).
3. **Own extra feature, "Impact Meter":** each event has a volunteer goal and joined count, shown as an animated progress bar on cards and on the details page, plus a live countdown on the details page, plus the search and filter on `/events`.

### Extra touches (add these too, they cost little and look great)
- Scroll progress bar at the top of the page and a back-to-top button.
- "Save" (bookmark) button on event cards, stored in localStorage, with a small saved-events count in the dropdown.
- "Add to Google Calendar" link on the event details page (a prefilled calendar URL).
- FAQ accordion on the home page (animated) with real answers about how MeraSEP works.
- Event details: "Similar events" row (same type) at the bottom.
- `Cmd/Ctrl + K` command palette (shadcn Command) to jump to pages and search events.

## 8. Quality bar
- **Split code into as many files as it needs.** Do not cram sections into one giant file. Every home section, card, form, skeleton, dialog and hook gets its own file under the right folder. Create new files freely whenever it keeps things clean, but do not create pointless wrapper files with no purpose.
- Accessible: semantic HTML, labels on all inputs, visible focus rings, `aria-label` on icon-only buttons, alt text on images.
- Server Components by default; add `"use client"` only where needed (forms, motion, hooks). Keep pages thin and put reusable parts in `src/components/{layout,home,events,auth,shared,ui}`.
- Consistent file naming (kebab-case), no dead code, no console logs, no leftover default Next.js boilerplate or default README text.
- Replace the default `README.md` with: the site name **MeraSEP**, a line `Live site: <add-live-url-here>`, a short description, and a feature list of at least 6 bullet points. Leave the live URL as a clear placeholder for me to fill in.

## 9. Phases (stop and summarise after each one, then wait for me to say "next")
1. **Foundation:** install `motion` and shadcn components, `globals.css` tokens for light and dark, fonts, `ThemeProvider`, `Toaster`, `Logo`, `ThemeToggle`, `SectionHeading`, types, mock data, `api.ts`, `use-auth` placeholder, `PrivateRoute`, `next.config.ts`, `.env.example`.
2. **Layout:** Navbar (all states) and Footer, `template.tsx` page transitions, `not-found`, `error`, root `loading`.
3. **Auth UI:** `/login` and `/register`, fully designed with validation messages, but with inert submit and Google buttons.
4. **Home page:** all sections.
5. **Events:** `/events` and `/events/[id]` with join flow, countdown, impact meter.
6. **Private pages:** `/create-event`, `/manage-events`, `/joined-events`, `/profile`.
7. **Polish:** responsive pass at 360 / 768 / 1280, dark-mode pass on every page, reduced-motion check, README, final `npm run lint` and `npm run build`.

## Definition of done
- `npm run lint` and `npm run build` pass clean.
- Every route renders in light and dark, and reloads without errors, including private routes (shown via `PREVIEW_AS_LOGGED_IN`).
- Changing `NEXT_PUBLIC_API_URL` to another JSON endpoint (array of events) loads that data everywhere with no code change.
- Login, Register, Google and Logout do nothing, everything else works.
- No Lorem text, no `alert()`, no horizontal scroll on mobile, all cards equal height.
- Every `TODO(mehedi)` seam is listed in a short summary at the end so I know exactly what to wire (auth, JWT, API endpoints).

Start with Phase 1 now.