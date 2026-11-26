export interface UpstreamPR {
  url: string;
  repo: string; // "owner/name"
  title: string;
  state: "open" | "merged";
  date: string; // ISO; mergedAt ?? createdAt
}

export interface RepoInfo {
  key: string; // requested repo name from showcaseRepos
  name: string;
  url: string;
  description: string | null;
  stars: number;
  language: string | null;
  topics: string[];
  pushedAt: string;
  homepage: string | null;
  defaultBranch: string;
  readme: string | null;
}

export interface Release {
  repo: string;
  tag: string;
  name: string;
  url: string;
  date: string;
}

export interface GitHubData {
  syncedAt: string;
  prs: UpstreamPR[];
  repos: RepoInfo[];
  releases: Release[];
}

export interface RawSearchPR {
  html_url: string;
  title: string;
  state: "open" | "closed";
  created_at: string;
  repository_url: string;
  pull_request: { merged_at: string | null };
}
