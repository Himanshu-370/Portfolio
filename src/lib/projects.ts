import type { Profile } from "@/data/profile";
import type { GitHubData } from "@/lib/github/types";
import { renderReadme } from "@/lib/readme";

export type ProjectStatus = "active" | "idle" | "archived";

export interface Project {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  meta: string;
  status: ProjectStatus;
  githubUrl?: string;
  stars?: number;
  language?: string | null;
  pushedAt?: string;
  cover?: string;
  images: string[];
  bodyHtml: string;
  live: boolean;
}

const DAY = 86_400_000;

export function buildProjects(profile: Profile, data: GitHubData, now: Date): Project[] {
  const projects: Project[] = [];

  for (const showcase of profile.showcaseRepos) {
    const repo = data.repos.find((r) => r.name === showcase.repo);
    if (!repo) continue;
    const override = showcase.override;
    const md = override?.body ?? repo.readme;
    const active = now.getTime() - new Date(repo.pushedAt).getTime() <= 90 * DAY;
    projects.push({
      slug: showcase.slug ?? showcase.repo,
      name: repo.name,
      summary: override?.summary ?? repo.description ?? "",
      stack: showcase.stack,
      meta: `★${repo.stars}`,
      status: active ? "active" : "idle",
      githubUrl: repo.url,
      stars: repo.stars,
      language: repo.language,
      pushedAt: repo.pushedAt,
      cover: override?.cover,
      images: override?.images ?? [],
      bodyHtml: md
        ? renderReadme(md, { owner: profile.githubUser, name: repo.name, branch: repo.defaultBranch })
        : "",
      live: true,
    });
  }

  for (const m of profile.manualProjects) {
    projects.push({
      slug: m.slug,
      name: m.name,
      summary: m.summary,
      stack: m.stack,
      meta: m.archived ? "archived" : m.year,
      status: m.archived ? "archived" : "idle",
      githubUrl: m.githubUrl,
      images: [],
      bodyHtml: m.body
        ? renderReadme(m.body, { owner: profile.githubUser, name: m.slug, branch: "main" })
        : "",
      live: false,
    });
  }

  return projects;
}
