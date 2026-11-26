# Portfolio revamp — "observability dashboard" design

Date: 2026-11-26 · Owner: Himanshu Singh · Site: https://himanshusingh.dev (Vercel)

## Intent

Replace the current dark, 3D, resume-shaped one-pager with a site that reads like a
**light, minimal observability dashboard** (Grafana/Datadog feel, adarshh.tech-level
restraint). It should reflect Himanshu's work and personality through *what it shows*,
not through emotional copy.

Primary audience: recruiters and engineers evaluating him. The two jobs of the site:

1. Get them to **book a call** (Google Meet via a calendar).
2. Let them **check his work**: experience, projects, open-source contributions.

The site should **keep itself current** from GitHub: his upstream PRs and a hand-picked
set of his own repos, so the event log and project pages update without manual edits.

## Goals

- Dashboard-shaped home page with real, dense content (not a sparse landing page).
- Live data from GitHub for: PRs to repos he doesn't own; selected own public repos.
- Project detail pages built from each repo's README, with a per-project override.
- "Let's talk" = embedded calendar booking that creates a Google Meet call.
- Interests (cooking, football, cricket, swimming) present as a quiet tile.
- Fast, accessible, works on phones; light by default, dark via system preference.

## Non-goals (now)

- Blog. Wanted later; structure should not block adding it (Astro content collections).
- Contact form, email address anywhere on the site (Formspree removed).
- Showing all 69 repos, commit-level activity, or forks.
- CMS / admin UI. Content is edited in a data file.

## Anti-goals (would make it a failure even if it works)

- Emotional / self-praising copy ("giver", "helping nature"). State facts and outcomes.
- Neon dark theme, 3D, heavy animation, gimmicky "hacker terminal" vibe.
- Dashboard theme that hurts scanning: a recruiter must find role, experience,
  projects and the "Let's talk" button within ~30 seconds.
- Unselected repos or closed-unmerged PRs leaking onto the site.
- Fabricated metrics. Every number is either computed from GitHub or taken from the résumé.
- A build that breaks because GitHub is down or rate-limits.

## Approaches considered

1. **Rebuild inside the existing Next.js app** with server-side fetch + ISR (~hourly).
   Keeps stack/CI; updates within an hour.
2. **Fresh Astro static site + scheduled rebuild** — *chosen by Himanshu.* Fully static,
   very fast; fresh data arrives on each scheduled rebuild.
3. **Client-side GitHub fetch in the browser.** Rejected: 60 req/hr/visitor rate limit,
   flicker/failures, empty page for search engines.

## Decided (by Himanshu)

- Direction B: observability dashboard, light, minimal.
- Live data only from (a) an **allow-list of his own public repos** and (b) **PRs he
  opened on repos he does not own**.
- Project pages pull the **README** from GitHub, with an **override** option.
- Project page shows: about (README), images, GitHub link.
- **No email** on the site's pages. "Let's talk" opens a **calendar to book a Google Meet
  call**. New account. The résumé PDF stays as is (its own contact details included).
- Interests: cooking, football, cricket, swimming. Professional, no emotional content.
- Blog: later.
- Build with **Astro**, static output, scheduled rebuilds.

## Design

### Stack

- Astro (latest stable), TypeScript strict, Tailwind CSS. Static output, deployed on the
  existing Vercel project (framework preset switched to Astro; domain unchanged).
- Interactive bits (event-log filter, time-range picker, career-trace detail panel) as
  small client scripts or a light island framework; no heavy runtime. *(Builder's call.)*
- Fonts: Inter (UI) + JetBrains Mono (data/labels), self-hosted.
- Remove: Next.js, React Three Fiber/three, framer-motion, Formspree, shadcn components.
- Keep: `public/Himanshu_Singh_Resume.pdf`, MIT license, README (rewritten).

### Pages

- `/` — the dashboard.
- `/projects/[slug]` — one per project (allow-listed repos + manual projects).
- `404`.

### Home dashboard layout (top → bottom)

1. **Top bar**: `himanshu-singh / prod` wordmark · time-range picker (`30d · 1y · all`,
   filters the event log) · status pill `● healthy · open to opportunities`
   (status text editable in data file).
2. **Hero** (left) + **stat tiles** (right, 2×2):
   - Headline with gray second half, e.g. "Software engineer *keeping infra observable
     & agents honest.*" + 2-line intro + buttons **Let's talk →** (scrolls to booking)
     and **Résumé** (PDF).
   - Stats *(Claude's call — Himanshu can swap)*: years in industry (computed from
     Jan 2024), upstream PRs merged (GitHub), OSS projects contributed to (GitHub, merged
     or open), engineers served by his dashboards (50+, from résumé).
3. **Services** (projects) panel + **Event log** panel side by side.
   - Services: each row = status dot, name, one-liner, stack, a right-aligned meta
     (stars / "pypi" / year / "archived"). Click → `/projects/[slug]`.
     Status dot: green if pushed in last 90 days, gray otherwise / archived.
   - Event log (monospace): `date · LEVEL · repo · title`, newest first. Levels:
     `MERGED` (green), `OPEN` (amber), `RELEASE` (blue). Each line links to the PR/release.
     Filter chips: all · merged · open · releases.
4. **Career trace**: Jaeger-style horizontal spans for SNU, CV Owl, HyperSwitch,
   Guidewire, one row each (overlaps are fine since rows are separate). **No nested
   project spans** *(Claude's call)*: projects live in Services, so the trace never
   implies which employer a project belongs to. Spans use real start/end dates
   (`YYYY-MM`, end `null` = present) in `profile.ts`. Click a span → detail panel
   with role, dates, metrics chips and bullets (content from current `lib/data.ts`).
   Achievements (MLH "Best Beginner Hack", SNU Design-a-thon) appear in the SNU span.
5. **Bottom tiles**: **Stack** (skills as tags, grouped) · **Off-call** (cooking,
   football, cricket, swimming — one line, small icons) · **Endpoints** (GitHub,
   LinkedIn, X `@himlabs` — no email).
6. **Book a call** section: inline Cal.com embed (Google Meet location), themed to match.
   Anchor target of "Let's talk".
7. Footer: © year · "last synced <timestamp>" from build data (nice honest touch).

On phones: single column, tiles stack, trace scrolls horizontally, nav collapses.

### Visual language

- Off-white background (`#f7f7f5`), white cards, 1px hairline borders, 10px radius,
  near-black ink, gray secondary text. Accent color only in status levels.
- Dark mode follows `prefers-color-scheme` by default; a top-bar toggle pins light/dark
  (saved in localStorage, applied before first paint). Tokens use CSS `light-dark()`.
  *(Changed 2026-11-26 at Himanshu's request; originally no toggle.)*
- Motion: minimal; respect `prefers-reduced-motion`.
- Reference mockup: `.superpowers/brainstorm/*/content/full-pages-v2.html`, option B.

### Content source of truth

`src/data/profile.ts` (typed) holds everything hand-written:
hero copy, status text, experience, education, achievements, skills, interests, socials,
Cal.com link, and:

- `showcaseRepos`: allow-list of own repos, each `{ repo, slug?, override? }`.
  Initial list *(Claude's call, Himanshu to confirm)*: `son-of-anton`, `cloudwire`.
- `manualProjects`: projects without a public repo (Feature Flow, VidVortex), with
  hand-written page content. They appear in Services with no live stats.
- `hiddenPRs`: list of PR URLs never to show.
- `override` fields per project: `summary`, `cover` image, `images[]`, `body` (markdown;
  if present, replaces README body). Override wins over README per field.

### GitHub sync (build time)

- Runs during `astro build`. Uses `GITHUB_TOKEN` (fine-grained, read-only public access)
  from Vercel env vars; never committed. Works unauthenticated locally if absent (slower,
  lower limits).
- Data fetched:
  - Upstream PRs: search `is:pr author:Himanshu-370 -user:Himanshu-370`; keep `open`
    and `merged`, drop closed-unmerged and `hiddenPRs`.
  - For each showcase repo: description, stars, language, topics, pushed date, homepage,
    latest releases, README (raw markdown).
- README rendering: markdown → HTML at build, sanitized; relative image/link URLs
  rewritten to `raw.githubusercontent.com` / repo blob URLs; badges allowed.
- The sync is a standalone module, also runnable as `npm run sync` outside `astro build`.
- **Fail-soft** *(Claude's call)*: `src/data/github-snapshot.json` is a committed fallback,
  refreshed by running `npm run sync` locally and committing it through a normal PR
  (e.g. alongside content edits). Vercel builds never write it back. If a live fetch
  fails, the build uses the snapshot and logs a warning. The build never fails because
  GitHub is unavailable. The snapshot may be somewhat stale; it only matters during a
  GitHub outage. No bot commits to `main`.

### Freshness (scheduled rebuild)

- GitHub Action on a cron (every 6 hours *— Claude's call*), plus manual dispatch, calls
  a **Vercel deploy hook** (stored as a GitHub Actions secret). Pushes to `main` deploy
  as usual. 4 deploys/day is well inside Vercel Hobby limits.
- GitHub disables scheduled workflows after 60 days without repo activity. The workflow
  re-enables itself each run via the GitHub API
  (`PUT /repos/{owner}/{repo}/actions/workflows/{id}/enable`, `actions: write`), so the
  schedule survives quiet months without needing commits *(Claude's call)*.

### Booking (Cal.com)

- Himanshu creates a Cal.com account, connects Google Calendar, creates a "30-min intro"
  event with Google Meet as location. Site stores the event link in `profile.ts`.
- Embed via Cal.com's inline embed script, themed (light/dark) to match.
  If the link is not set yet, the section shows a disabled "Booking opens soon" state
  rather than breaking.
- A short setup checklist for Himanshu goes in the repo README.

### SEO & sharing

Title/description/OpenGraph/Twitter meta; generated OG image (static is fine);
sitemap; canonical URL `https://himanshusingh.dev`.

### Quality bar

- Tests (Vitest) for the data layer: PR filtering, README URL rewriting, override merge,
  snapshot fallback.
- `astro check` (type check) + lint + build in CI (`.github/workflows/ci.yml` updated).
- Lighthouse ≥ 95 performance/accessibility on the home page.
- Accessibility: semantic landmarks, keyboard-reachable trace spans and filters,
  sufficient contrast in both themes, skip link.

## Left to the builder

- Exact island approach for interactivity; component structure; markdown library choice.
- Exact copy polish (within the anti-goals).
- OG image design.
- Cron cadence can be tuned (keep within Vercel limits).

## Needs Himanshu (outside code)

- Create Cal.com account + event; send the link.
- Create fine-grained GitHub token → Vercel env `GITHUB_TOKEN`.
- Create Vercel deploy hook → GitHub Actions secret `VERCEL_DEPLOY_HOOK_URL`.
- Switch Vercel project framework preset to Astro when the PR is ready.
