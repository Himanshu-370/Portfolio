# Himanshu Singh — Portfolio

[![CI](https://github.com/Himanshu-370/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Himanshu-370/Portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Personal portfolio website with an interactive 3D hero, smooth scroll animations, and a responsive dark-themed UI.

**Live:** [himanshusingh.dev](https://himanshusingh.dev)

**Tech Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · React Three Fiber · Framer Motion · shadcn/ui

## Features

- Interactive 3D wireframe torus with floating particles (React Three Fiber)
- Smooth scroll animations (Framer Motion)
- Tabbed skill categories with keyboard navigation
- Experience timeline with expandable bullet points and metric chips
- Project showcase with GitHub/external links
- Contact form via Formspree with inline feedback
- Responsive mobile navigation (Sheet drawer)
- Accessibility: skip-nav, ARIA tabs, reduced-motion support, semantic headings

## Project Structure

```
app/
  page.tsx          # Thin orchestrator — nav + section layout
  layout.tsx        # Root layout with metadata/SEO
  globals.css       # Tailwind + CSS variables
components/
  three-scene.tsx   # 3D hero (lazy-loaded, SSR-disabled)
  sections/         # Page sections (hero, about, skills, experience, projects, contact)
  ui/               # shadcn/ui components (badge, button, card, sheet)
lib/
  data.ts           # All resume content as typed constants
  utils.ts          # cn() utility
public/
  Himanshu_Singh_Resume.pdf
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FORMSPREE_URL` | Formspree form endpoint for the contact form |

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |

## Deployment

Deploy on [Vercel](https://vercel.com) — no additional configuration needed beyond setting the `NEXT_PUBLIC_FORMSPREE_URL` environment variable in the Vercel dashboard.

## License

[MIT](LICENSE)
