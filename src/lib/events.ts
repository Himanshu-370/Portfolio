// Imported by a client-side script: type-only imports, no Node APIs.
import type { GitHubData } from "./github/types";

export type Level = "MERGED" | "OPEN" | "RELEASE";
export interface LogEvent {
  date: string;
  level: Level;
  repo: string;
  title: string;
  url: string;
}
export type Range = "30d" | "1y" | "all";

const DAY = 86_400_000;

export function toEvents(data: GitHubData): LogEvent[] {
  const prs: LogEvent[] = data.prs.map((p) => ({
    date: p.date,
    level: p.state === "merged" ? "MERGED" : "OPEN",
    repo: p.repo,
    title: p.title,
    url: p.url,
  }));
  const releases: LogEvent[] = data.releases.map((r) => ({
    date: r.date,
    level: "RELEASE",
    repo: r.repo,
    title: r.name || r.tag,
    url: r.url,
  }));
  // Array.prototype.sort is stable: PRs stay before releases on ties.
  return [...prs, ...releases].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function filterEvents(
  events: LogEvent[],
  range: Range,
  kind: "all" | Level,
  now: Date,
): LogEvent[] {
  const days = range === "30d" ? 30 : range === "1y" ? 365 : null;
  const cutoff = days === null ? -Infinity : now.getTime() - days * DAY;
  return events.filter(
    (e) => Date.parse(e.date) >= cutoff && (kind === "all" || e.level === kind),
  );
}
