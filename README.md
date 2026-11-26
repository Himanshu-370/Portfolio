# Himanshu Singh — Portfolio

[![CI](https://github.com/Himanshu-370/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Himanshu-370/Portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A light, minimal portfolio laid out like an observability dashboard: projects are "services", career is a "trace", and open-source pull requests show up as an activity feed. Project and PR data is pulled from GitHub, so the site updates itself.

**Live:** [himanshusingh.dev](https://himanshusingh.dev)

## Stack

Astro (static output) · TypeScript · Tailwind CSS v4 · Vitest · deployed on Vercel.

## Local development

```bash
npm install
npm run dev      # dev server at http://localhost:4321
npm run check    # type check
npm test         # unit tests
npm run lint     # eslint
npm run build    # static build into dist/
npm run preview  # serve the built site
npm run sync     # refresh the GitHub snapshot (see below)
```

## Editing content

Almost everything lives in `src/data/profile.ts`:

- `showcaseRepos`: the repos shown as projects. Each has a `repo` name, a `stack` list, an optional `slug`, and an optional `override` (`summary`, `cover`, `images`, `body`) that replaces what GitHub provides.
- `manualProjects`: projects that are not on GitHub (or are archived). You write the summary and body yourself.
- `hiddenPRs`: pull request URLs to leave out of the activity feed.
- `calLink`: your Cal.com `username/event-slug`. While it is `null`, no booking button is shown.
- Career, skills, socials and the intro text are in the same file.
- For an authenticated local `npm run sync`, copy `.env.example` to `.env` and put a GitHub token there.

To refresh the committed GitHub snapshot, run `npm run sync`, then commit `src/data/github-snapshot.json` through a pull request.

## How data stays fresh

1. At build time the site fetches repos, READMEs, releases and PRs from GitHub (using `GITHUB_TOKEN` if set).
2. If GitHub is unreachable or rate-limited, the build falls back to the committed snapshot, so it never breaks.
3. A GitHub Actions workflow (`refresh.yml`) calls a Vercel deploy hook every 6 hours, which rebuilds the site with fresh data.

## Owner setup checklist

1. **Cal.com booking**
   - Sign up at cal.com and connect Google Calendar.
   - Create a 30-minute event called "Intro call" with Google Meet as the location.
   - Put the `username/event-slug` in `calLink` in `src/data/profile.ts`.
2. **GitHub token**
   - Create a fine-grained personal access token. Resource owner: your account. Repository access: Public repositories (read-only). Add no extra permissions.
   - In Vercel, add it as the environment variable `GITHUB_TOKEN` for Production and Preview.
3. **Scheduled rebuilds**
   - In Vercel: Settings → Git → Deploy Hooks → create a hook for the `main` branch.
   - Add the hook URL as a repository secret named `VERCEL_DEPLOY_HOOK_URL` (GitHub: Settings → Secrets and variables → Actions).
4. **Vercel project settings**
   - Settings → Build & Deployment: Framework Preset = Astro, Output Directory = `dist`, Node.js version = 24.

## License

[MIT](LICENSE)
