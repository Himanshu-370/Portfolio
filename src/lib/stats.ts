import type { Profile } from "@/data/profile";
import type { GitHubData } from "@/lib/github/types";

export interface Stat {
  value: string;
  label: string;
}

export function computeStats(profile: Profile, data: GitHubData, now: Date): Stat[] {
  const [y, m] = profile.careerStart.split("-").map(Number) as [number, number];
  const years = (now.getTime() - Date.UTC(y, m - 1, 1)) / (365.25 * 86_400_000);
  return [
    { value: `${years.toFixed(1)}y`, label: "in industry" },
    { value: String(data.prs.filter((p) => p.state === "merged").length), label: "upstream PRs merged" },
    { value: String(new Set(data.prs.map((p) => p.repo)).size), label: "OSS projects contributed to" },
    ...profile.manualStats.map((s) => ({ value: s.value, label: s.label })),
  ];
}
