import { profile } from "@/data/profile";
import type { Profile } from "@/data/profile";
import { loadGitHubData } from "@/lib/github/load";
import type { GitHubData } from "@/lib/github/types";
import { buildProjects, type Project } from "@/lib/projects";
import { toEvents, type LogEvent } from "@/lib/events";
import { computeStats, type Stat } from "@/lib/stats";
import { spanGeometry, type SpanBox } from "@/lib/trace";

export interface SiteData {
  profile: Profile;
  data: GitHubData;
  projects: Project[];
  events: LogEvent[];
  stats: Stat[];
  spans: SpanBox[];
}

let cached: Promise<SiteData> | undefined;

export function getSiteData(): Promise<SiteData> {
  cached ??= (async () => {
    const now = new Date();
    const data = await loadGitHubData();
    return {
      profile,
      data,
      projects: buildProjects(profile, data, now),
      events: toEvents(data),
      stats: computeStats(profile, data, now),
      spans: spanGeometry(profile.career, now),
    };
  })();
  return cached;
}
