# Portfolio Revamp ("observability dashboard") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Next.js 3D one-pager with a light, minimal Astro site shaped like an observability dashboard that refreshes Himanshu's upstream PRs and selected repos from GitHub at build time.

**Architecture:** Static Astro site. A pure-TypeScript data layer (`src/lib/`) fetches GitHub at build (falling back to a committed snapshot), merges it with hand-written content in `src/data/profile.ts`, and derives projects, events, stats and trace geometry. Astro components render the dashboard; two tiny client scripts handle the event-log filters and the career-trace detail panel. A scheduled GitHub Action triggers a Vercel deploy hook every 6 hours.

**Tech Stack:** Astro 7.4, TypeScript 6 (strict), Tailwind CSS 4 (`@tailwindcss/vite`), Vitest 5, marked 18 + sanitize-html 2.18, @astrojs/sitemap, @fontsource-variable/inter + jetbrains-mono, Node 24.

**Spec:** `docs/superpowers/specs/2026-11-26-portfolio-revamp-design.md`

## Global Constraints

- Node ≥ 22.23 locally and **Node 24** in CI. TypeScript `^6` (`@astrojs/check` does not accept 7).
- Static output only. No client-side GitHub calls. No React, Three.js, framer-motion, Formspree.
- **No email address anywhere in site pages.** Socials: GitHub `https://github.com/Himanshu-370`, LinkedIn `https://www.linkedin.com/in/himanshusingh20/`, X `https://x.com/himlabs`. Résumé `public/Himanshu_Singh_Resume.pdf` kept unchanged.
- GitHub user: `Himanshu-370`. Token from env `GITHUB_TOKEN` only; never committed. Absent token must still work (unauthenticated).
- Show only PRs with state open or merged, on repos not owned by `Himanshu-370`, minus `hiddenPRs`. Own repos only from `showcaseRepos`.
- Build must never fail because GitHub is unreachable / rate-limited → use `src/data/github-snapshot.json`.
- Copy: factual, no emotional/self-praising language. Metrics only from GitHub or the résumé (`lib/data.ts`).
- Visual tokens (light): bg `#f7f7f5`, card `#ffffff`, ink `#151515`, muted `#82827c`, line `#e6e6e1`; levels MERGED green `#1a7f37` on `#e6f4ea`, OPEN amber `#9a6700` on `#fdf3e1`, RELEASE blue `#3451b2` on `#eaeefb`. Radius 10px, 1px hairline borders. Dark mode via `prefers-color-scheme` only (no toggle).
- Respect `prefers-reduced-motion`; all interactive elements keyboard-reachable; skip link.
- Canonical URL `https://himanshusingh.dev`.
- Commits: Conventional Commits, subject < 72 chars, tests passing.

## Review Focus

1. **README with relative/HTML images** (`./docs/a.png`, `<img src="docs/a.png">`, `../x.gif`) → images still load on the project page; absolute URLs and `#anchor` links untouched. Test in Task 4.
2. **README containing raw HTML/script** (`<script>`, `onerror=`, `javascript:` links) → stripped; badges/images/tables kept. Test in Task 4.
3. **Showcase repo renamed, deleted or made private (404)** → that project is dropped with a warning, rest of the build succeeds. Test in Task 3 (`syncGitHub`) and Task 5 (`buildProjects`).
4. **GitHub down / rate-limited / no token** → build succeeds from snapshot and logs a warning. Test in Task 3.
5. **Empty data** (no PRs in the chosen time range, repo without README) → event log shows "No events in this range"; project page shows summary without crashing. Tests in Task 5; manual check in Task 7/9.

---

## File Structure

```
astro.config.mjs            site, integrations (sitemap), tailwind vite plugin
vitest.config.ts
package.json / tsconfig.json
src/data/profile.ts         ALL hand-written content + types (single source of truth)
src/data/github-snapshot.json  committed fallback of GitHubData
src/lib/github/types.ts     raw + normalized GitHub types
src/lib/github/client.ts    ghFetch(): fetch wrapper (token, headers, errors)
src/lib/github/sync.ts      syncGitHub(): GitHubData
src/lib/github/load.ts      loadGitHubData(): live → snapshot fallback
src/lib/readme.ts           rewriteReadmeUrls(), renderReadme()
src/lib/projects.ts         buildProjects()
src/lib/events.ts           toEvents(), filterEvents()
src/lib/stats.ts            computeStats()
src/lib/trace.ts            spanGeometry()
src/lib/site.ts             getSiteData(): everything pages need (memoized)
scripts/sync.ts             `npm run sync` → writes snapshot
src/styles/global.css       tokens, base styles, dark mode
src/layouts/Base.astro      <head>, SEO, fonts, skip link
src/components/*.astro      TopBar, Hero, StatTiles, Services, EventLog, CareerTrace,
                            BottomTiles, BookCall, Footer
src/scripts/event-log.ts    client: chips + range filtering
src/scripts/trace.ts        client: span → detail panel
src/pages/index.astro, src/pages/projects/[slug].astro, src/pages/404.astro
public/og.png
tests/*.test.ts
.github/workflows/ci.yml (modify), .github/workflows/refresh.yml (new)
README.md (rewrite)
```

Deleted: `app/`, `components/`, `lib/` (after porting content), `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `components.json`, `eslint.config.mjs`, `.env.example` (replaced), `next-env.d.ts` if present.

---

### Task 1: Scaffold Astro, remove Next.js, tooling and CI

**Files:**
- Delete: listed above except `lib/data.ts` (kept until Task 2 ports it)
- Create: `astro.config.mjs`, `vitest.config.ts`, `src/pages/index.astro` (placeholder "himanshu-singh / prod"), `tests/smoke.test.ts`, `.nvmrc` (`24`)
- Modify: `package.json`, `tsconfig.json`, `.gitignore` (add `dist/`, `.astro/`; remove `.next/`), `.github/workflows/ci.yml`, `.env.example` (only `GITHUB_TOKEN=`)

**Interfaces:**
- Produces: scripts `dev`, `build` (`astro build`), `check` (`astro check`), `test` (`vitest run`), `sync` (`tsx scripts/sync.ts`); path alias `@/*` → `src/*`.

- [ ] **Step 1:** Remove Next/React/three/framer/radix/shadcn deps; add `astro@^7.4.13`, `@astrojs/check@^0.9.12`, `@astrojs/sitemap@^3.7.6`, `tailwindcss@^4.3.5`, `@tailwindcss/vite@^4.3.5`, `marked@^18.3.0`, `sanitize-html@^2.18.2`, `@fontsource-variable/inter@^5.3.0`, `@fontsource-variable/jetbrains-mono@^5.3.0`; dev: `vitest@^5.1.2`, `typescript@^6`, `@types/sanitize-html`, `@types/node@^24`, `tsx`. Set `"engines": {"node": ">=22.23"}`. `tsconfig.json` extends `astro/tsconfigs/strict`.
- [ ] **Step 2:** Write `tests/smoke.test.ts`: `expect(1 + 1).toBe(2)` (proves Vitest runs).
- [ ] **Step 3:** CI: Node 24, steps `npm ci`, `npm run check`, `npm test`, `npm run build` (no Formspree env).
- [ ] **Step 4:** Run `npm install && npm run check && npm test && npm run build` → all exit 0, `dist/index.html` exists.
- [ ] **Step 5:** Commit `chore: replace Next.js app with Astro scaffold`.

### Task 2: Profile content and types

**Files:**
- Create: `src/data/profile.ts`, `tests/profile.test.ts`
- Delete: `lib/data.ts` (after porting)

**Interfaces:**
- Produces (exported from `src/data/profile.ts`):
```ts
export type YearMonth = `${number}-${string}`            // "2024-01"
export interface CareerSpan { id: string; label: string; role: string; org: string;
  start: YearMonth; end: YearMonth | null; location: string; kind: 'education' | 'work' | 'oss';
  metrics: string[]; bullets: string[] }
export interface ProjectOverride { summary?: string; cover?: string; images?: string[]; body?: string }
export interface ShowcaseRepo { repo: string; slug?: string; stack: string[]; override?: ProjectOverride }
export interface ManualProject { slug: string; name: string; summary: string; stack: string[];
  year: string; archived: boolean; body: string; githubUrl?: string }
export interface Profile { name: string; githubUser: string; status: string;
  headline: { lead: string; tail: string }; intro: string; careerStart: YearMonth;
  manualStats: { label: string; value: string }[]; career: CareerSpan[];
  achievements: { spanId: string; text: string }[]; skills: { label: string; items: string[] }[];
  interests: { label: string; icon: string }[]; socials: { label: string; url: string }[];
  calLink: string | null; resumeUrl: string; showcaseRepos: ShowcaseRepo[];
  manualProjects: ManualProject[]; hiddenPRs: string[] }
export const profile: Profile
```
- Values: `status: "open to opportunities"`, headline lead `"Software engineer"` tail `"keeping infra observable & agents honest."`, `careerStart: "2024-01"`, `manualStats: [{label:"engineers using my dashboards", value:"50+"}]`, career spans SNU (2020-08→2024-05, education), CV Owl (2022-10→2023-10), HyperSwitch (2023-10→2023-11, oss), Guidewire (2024-01→null) with metrics/bullets ported verbatim from `lib/data.ts`; achievements both under `snu`; skills ported; interests cooking 🍳, football ⚽, cricket 🏏, swimming 🏊; socials GitHub/LinkedIn/X only; `calLink: null`; `resumeUrl: "/Himanshu_Singh_Resume.pdf"`; showcaseRepos `son-of-anton` (stack TypeScript, Docker, Agents) and `cloudwire` (Python, FastAPI, React; override summary from current Cloudwire copy); manualProjects Feature Flow (2025, not archived) and VidVortex (2023, archived) with bodies from current bullets; `hiddenPRs: []`.

- [ ] **Step 1: Failing tests** `tests/profile.test.ts`:
  - `no email in profile`: `JSON.stringify(profile)` does not match `/@[a-z0-9-]+\.[a-z]{2,}/i` and not `/mailto:/`.
  - `career spans are valid`: every `start` matches `/^\d{4}-\d{2}$/`, `end` null or ≥ start; ids unique.
  - `achievements reference real spans`.
  - `slugs unique across showcase + manual` (showcase slug defaults to `repo`).
- [ ] **Step 2:** Run `npm test` → FAIL (module missing).
- [ ] **Step 3:** Write `src/data/profile.ts`; delete `lib/data.ts`.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: add typed profile content`.

### Task 3: GitHub sync with snapshot fallback

**Files:**
- Create: `src/lib/github/types.ts`, `client.ts`, `sync.ts`, `load.ts`, `scripts/sync.ts`, `src/data/github-snapshot.json`, `tests/github.test.ts`

**Interfaces:**
- Produces:
```ts
// types.ts
export interface UpstreamPR { url: string; repo: string /* "owner/name" */; title: string;
  state: 'open' | 'merged'; date: string /* ISO; mergedAt ?? createdAt */ }
export interface RepoInfo { name: string; url: string; description: string | null; stars: number;
  language: string | null; topics: string[]; pushedAt: string; homepage: string | null;
  defaultBranch: string; readme: string | null }
export interface Release { repo: string; tag: string; name: string; url: string; date: string }
export interface GitHubData { syncedAt: string; prs: UpstreamPR[]; repos: RepoInfo[]; releases: Release[] }
export interface RawSearchPR { html_url: string; title: string; state: 'open' | 'closed';
  created_at: string; repository_url: string; pull_request: { merged_at: string | null } }
// client.ts
export class GitHubNotFound extends Error {}
export function ghFetch<T>(path: string, opts?: { raw?: boolean; fetchImpl?: typeof fetch }): Promise<T>
// sync.ts
export function normalizePRs(raw: RawSearchPR[], hidden: string[]): UpstreamPR[]
export function syncGitHub(opts?: { fetchImpl?: typeof fetch; now?: Date }): Promise<GitHubData>
// load.ts
export function loadGitHubData(opts?: { sync?: () => Promise<GitHubData>; snapshot?: GitHubData;
  warn?: (msg: string) => void }): Promise<GitHubData>
```
- `ghFetch`: base `https://api.github.com`, headers `Accept: application/vnd.github+json` (or `.raw` for README), `X-GitHub-Api-Version: 2022-11-28`, `Authorization: Bearer $GITHUB_TOKEN` only if set; 404 → `GitHubNotFound`; other non-2xx → `Error` with status.
- Search query: `is:pr author:Himanshu-370 -user:Himanshu-370`, `per_page=100`, sort created desc. Per showcase repo: `GET /repos/Himanshu-370/{repo}`, `/readme` (raw; 404 → `readme: null`), `/releases?per_page=5`. Repo 404 → skip repo, `console.warn`.
- `loadGitHubData`: try `sync()`; on any throw → `warn("GitHub sync failed, using snapshot: …")` and return snapshot.

- [ ] **Step 1: Failing tests** (`fetchImpl` stub, no network):
  - `normalizePRs keeps open and merged, drops closed-unmerged`: 3 raw PRs (open; closed+merged_at `2026-11-20T…`; closed+null) → 2 results, states `['open','merged']`, merged `date === merged_at`, `repo === 'kubevela/kubevela'` from `repository_url` `https://api.github.com/repos/kubevela/kubevela`.
  - `normalizePRs drops hiddenPRs by url`.
  - `syncGitHub skips a 404 showcase repo`: stub 404 for `cloudwire` → `repos.map(r=>r.name)` equals `['son-of-anton']`, no throw.
  - `syncGitHub sets readme null when /readme 404s`.
  - `ghFetch sends Authorization only when GITHUB_TOKEN set`.
  - `loadGitHubData falls back to snapshot on error`: `sync` rejects (e.g. 403 rate limit) → returns snapshot, `warn` called once.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement the four modules. `scripts/sync.ts` calls `syncGitHub()` and writes pretty JSON to `src/data/github-snapshot.json`.
- [ ] **Step 4:** `npm test` → PASS. Then `npm run sync` (network) → snapshot contains ≥1 PR on `kubevela/kubevela` and repos `son-of-anton`, `cloudwire`.
- [ ] **Step 5:** Commit `feat: sync GitHub PRs and showcase repos with fallback`.

### Task 4: README rewriting and safe rendering

**Files:** Create `src/lib/readme.ts`, `tests/readme.test.ts`

**Interfaces:**
- Produces:
```ts
export function rewriteReadmeUrls(md: string, repo: { owner: string; name: string; branch: string }): string
export function renderReadme(md: string, repo: { owner: string; name: string; branch: string }): string // safe HTML
```
- Relative image src (markdown and `<img>`) → `https://raw.githubusercontent.com/{owner}/{name}/{branch}/{path}`; relative links → `https://github.com/{owner}/{name}/blob/{branch}/{path}`. Leading `./` stripped, `../` resolved against repo root (clamped). Absolute `http(s):`, protocol-relative, `#anchor`, `mailto:` left as-is (mailto is in README content, not site copy).
- sanitize-html allow-list: default tags + `img`, `h1`–`h6`, `details`, `summary`, `picture`, `source`; attrs `img[src,alt,width,height]`, `a[href,title]`, `source[srcset,media]`; schemes `http`,`https`; add `rel="noopener"` and `target="_blank"` to absolute links.

- [ ] **Step 1: Failing tests**:
  - `![a](./docs/shot.png)` → contains `https://raw.githubusercontent.com/Himanshu-370/cloudwire/main/docs/shot.png`.
  - `<img src="docs/demo.gif" width="400">` → same raw prefix + `docs/demo.gif`, width kept.
  - `[guide](CONTRIBUTING.md)` → `https://github.com/Himanshu-370/cloudwire/blob/main/CONTRIBUTING.md`.
  - `[x](#install)` and `![b](https://img.shields.io/badge/x)` unchanged.
  - `<script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">y</a>` → output has no `<script`, no `onerror`, no `javascript:`.
  - GFM table renders `<table>`.
- [ ] **Step 2:** `npm test` → FAIL. **Step 3:** implement (marked GFM → rewrite → sanitize; do rewriting on the rendered HTML via sanitize-html `transformTags` so markdown and raw `<img>` share one path). **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: render READMEs with rewritten URLs and sanitizing`.

### Task 5: Derived data — projects, events, stats, trace

**Files:** Create `src/lib/projects.ts`, `events.ts`, `stats.ts`, `trace.ts`, `site.ts`, `tests/derive.test.ts`

**Interfaces:**
- Consumes: `Profile` (Task 2), `GitHubData` (Task 3), `renderReadme` (Task 4).
- Produces:
```ts
// projects.ts
export type ProjectStatus = 'active' | 'idle' | 'archived'
export interface Project { slug: string; name: string; summary: string; stack: string[];
  meta: string; status: ProjectStatus; githubUrl?: string; stars?: number; language?: string | null;
  pushedAt?: string; cover?: string; images: string[]; bodyHtml: string; live: boolean }
export function buildProjects(profile: Profile, data: GitHubData, now: Date): Project[]
// events.ts
export type Level = 'MERGED' | 'OPEN' | 'RELEASE'
export interface LogEvent { date: string; level: Level; repo: string; title: string; url: string }
export type Range = '30d' | '1y' | 'all'
export function toEvents(data: GitHubData): LogEvent[]           // newest first
export function filterEvents(e: LogEvent[], range: Range, kind: 'all' | Level, now: Date): LogEvent[]
// stats.ts
export interface Stat { value: string; label: string }
export function computeStats(profile: Profile, data: GitHubData, now: Date): Stat[]
// trace.ts
export interface SpanBox { id: string; leftPct: number; widthPct: number }
export function spanGeometry(spans: CareerSpan[], now: Date): SpanBox[]
// site.ts
export function getSiteData(): Promise<{ profile: Profile; data: GitHubData; projects: Project[];
  events: LogEvent[]; stats: Stat[]; spans: SpanBox[] }>   // memoized, now = build time
```
- Rules: showcase projects first (order of `showcaseRepos`), then manual. Showcase repo absent from `data.repos` → omitted. Status: `archived` if manual+archived; `active` if `pushedAt` within 90 days of `now`; else `idle`. Summary: override.summary ?? repo.description ?? `""`. bodyHtml: override.body (rendered) ?? readme (rendered) ?? `""`. Meta: `★{stars}` for live repos, `year` for manual (`"archived"` if archived).
- Stats in order: years `((now - careerStart)/365.25d).toFixed(1)+"y"` "in industry"; merged PR count "upstream PRs merged"; distinct PR repos (open or merged) "OSS projects contributed to"; then `manualStats`.
- Trace: timeline from earliest start to `now`; `end: null` = now; months inclusive; minimum width 2%.

- [ ] **Step 1: Failing tests** (fixed `now = 2026-11-26`):
  - `buildProjects omits showcase repo missing from data` and `still returns manual projects`.
  - `override summary wins over repo description`; `README null and no override → bodyHtml ""`.
  - `status active when pushed 10 days ago, idle when 200 days ago`.
  - `toEvents merges PRs and releases newest first with correct levels`.
  - `filterEvents('30d','all') excludes a 40-day-old event`; `filterEvents('all','MERGED')` only merged; `filterEvents on [] returns []`.
  - `computeStats`: careerStart `2024-01` → first stat value `"2.9y"`; with PRs [merged kubevela, open kubevela, open deepeval] → merged `"1"`, projects `"2"`; last stat `"50+"`.
  - `spanGeometry`: Guidewire (2024-01→null) ends at 100% (`leftPct + widthPct ≈ 100`); HyperSwitch width ≥ 2.
- [ ] **Step 2:** FAIL. **Step 3:** implement. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: derive projects, events, stats and trace`.

### Task 6: Design system, layout, top bar, hero, stat tiles

**Files:** Create `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/TopBar.astro`, `Hero.astro`, `StatTiles.astro`; modify `src/pages/index.astro`

**Interfaces:**
- `Base.astro` props `{ title: string; description: string; path: string }` → canonical `https://himanshusingh.dev{path}`, OG/Twitter meta with `/og.png`, imports fonts + global.css, skip link to `#main`.
- Components take data via props from `getSiteData()`; no component fetches.

- [ ] **Step 1:** `global.css`: Tailwind import, tokens from Global Constraints as CSS vars, dark set under `@media (prefers-color-scheme: dark)` (bg `#0f0f0e`, card `#171716`, ink `#ededea`, muted `#8f8f89`, line `#2a2a28`, level backgrounds at ~15% alpha), `.mono` utility, reduced-motion rule.
- [ ] **Step 2:** TopBar: `himanshu-singh / prod` (mono), range picker buttons `30d · 1y · all` (default `all`, `data-range`), status pill `● healthy · {profile.status}`. Hero: `<h1>` lead + muted tail, intro, buttons **Let's talk →** (`href="#book"`) and **Résumé** (`profile.resumeUrl`). StatTiles 2×2 grid.
- [ ] **Step 3:** Run `npm run check && npm run build` → exit 0; `npm run dev` and visually compare to mockup B at 1280px and 375px (no horizontal scroll at 375px).
- [ ] **Step 4:** Commit `feat: add dashboard layout, hero and stat tiles`.

### Task 7: Services panel and event log with filters

**Files:** Create `src/components/Services.astro`, `EventLog.astro`, `src/scripts/event-log.ts`

**Interfaces:**
- Consumes: `Project[]`, `LogEvent[]`, `filterEvents`, `Range`, `Level`.
- EventLog renders all events server-side as `<li data-date data-level>`; `event-log.ts` reads the active chip (`all|MERGED|OPEN|RELEASE`) and the TopBar range, calls `filterEvents`-equivalent logic by importing `filterEvents` from `@/lib/events`, toggles `hidden`, and shows `<p data-empty>No events in this range</p>` when nothing is visible. Chips are `<button aria-pressed>`.
- Services row: status dot (`active` green, `idle`/`archived` gray), name, summary, stack, meta; whole row is a link to `/projects/{slug}`.

- [ ] **Step 1:** Build components + script.
- [ ] **Step 2:** `npm run check && npm run build` → exit 0. In `npm run dev`: click `30d` with snapshot data → only recent events; choose a chip with no matches → empty message visible; keyboard Tab reaches every chip and row.
- [ ] **Step 3:** Commit `feat: add services panel and filterable event log`.

### Task 8: Career trace, bottom tiles, booking, footer

**Files:** Create `src/components/CareerTrace.astro`, `BottomTiles.astro`, `BookCall.astro`, `Footer.astro`, `src/scripts/trace.ts`; modify `src/pages/index.astro`

**Interfaces:**
- CareerTrace: one row per `CareerSpan`, bar positioned with `SpanBox`; each bar is a `<button aria-controls="trace-detail">`; `trace.ts` fills the detail panel (role, org, dates, location, metrics chips, bullets, achievements for that span) from a JSON `<script type="application/json" id="trace-data">`. Wrapper `overflow-x:auto` with `min-width:640px` for phones.
- BottomTiles: Stack (skills grouped), Off-call (interests), Endpoints (socials, `rel="me noopener"`).
- BookCall `id="book"`: if `profile.calLink` → Cal.com inline embed (official embed snippet, `calLink`, `layout: "month_view"`, theme follows `prefers-color-scheme`); else a card "Booking opens soon" with LinkedIn as the fallback action. No email.
- Footer: `© {year} Himanshu Singh · last synced {data.syncedAt formatted "26 Nov 2026, 18:00 UTC"}`.

- [ ] **Step 1:** Build components; assemble index order: TopBar, Hero+Stats, Services+EventLog, CareerTrace, BottomTiles, BookCall, Footer.
- [ ] **Step 2:** `npm run check && npm run build` → exit 0. Manual: click/Enter on each span shows correct details; with `calLink: null` the fallback renders; temporarily set `calLink: "himanshu/intro"` and confirm embed loads, then revert; `grep -i "@gmail\|mailto" dist/index.html dist/404.html` → no output (project pages may carry mailto links from a repo's own README; that is repo content, not site copy).
- [ ] **Step 3:** Commit `feat: add career trace, tiles, booking and footer`.

### Task 9: Project pages, 404, SEO

**Files:** Create `src/pages/projects/[slug].astro`, `src/pages/404.astro`, `public/og.png` (1200×630, wordmark + headline on bg token); modify `astro.config.mjs` (`site: "https://himanshusingh.dev"`, sitemap)

**Interfaces:**
- `getStaticPaths()` from `getSiteData().projects`. Page: back link, name, summary, meta row (stars, language, last updated, status), **View on GitHub ↗** if `githubUrl`, cover + `images` gallery if present, then `bodyHtml` in a `.prose` container (styled headings, code, tables, images max-width 100%). Empty body → only summary.

- [ ] **Step 1:** Build pages.
- [ ] **Step 2:** `npm run build` → `dist/projects/son-of-anton/index.html`, `dist/projects/cloudwire/index.html`, `dist/projects/feature-flow/index.html`, `dist/sitemap-index.xml` exist. Manual: cloudwire README images load; page usable at 375px.
- [ ] **Step 3:** Commit `feat: add project pages, 404 and SEO`.

### Task 10: Scheduled refresh, docs, final verification

**Files:** Create `.github/workflows/refresh.yml`; rewrite `README.md`

- refresh.yml: `on: schedule: cron "0 */6 * * *"` + `workflow_dispatch`; `permissions: actions: write`; steps: (1) `curl -fsS -X POST "$VERCEL_DEPLOY_HOOK_URL"` from secret `VERCEL_DEPLOY_HOOK_URL` (skip with a notice if unset); (2) `gh api -X PUT repos/${{ github.repository }}/actions/workflows/refresh.yml/enable` with `GH_TOKEN: ${{ github.token }}`.
- README: what the site is, stack, `npm run dev/test/check/build/sync`, how to edit `profile.ts` (showcase list, overrides, hiddenPRs, calLink), and the **owner setup checklist**: Cal.com account + Google Calendar + "30-min intro" event with Google Meet → set `calLink`; fine-grained GitHub token (public repos read-only) → Vercel env `GITHUB_TOKEN`; Vercel deploy hook → repo secret `VERCEL_DEPLOY_HOOK_URL`; Vercel framework preset → Astro, output dir `dist`.

- [ ] **Step 1:** Write files. Validate workflow YAML parses (`npx --yes yaml-lint .github/workflows/refresh.yml` or `node -e` with `yaml`).
- [ ] **Step 2:** Full verification: `npm run check && npm test && npm run build` all exit 0; Lighthouse (Chrome DevTools or `npx lighthouse http://localhost:4321 --only-categories=performance,accessibility`) on `npm run preview` → both ≥ 95; secret scan of the branch diff (`git diff main --stat` + grep for tokens) clean.
- [ ] **Step 3:** Commit `chore: add scheduled refresh workflow and docs`.
