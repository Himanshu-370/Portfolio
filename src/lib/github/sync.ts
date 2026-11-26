import { profile } from "@/data/profile";
import { ghFetch, GitHubNotFound } from "./client";
import type { GitHubData, RawSearchPR, Release, RepoInfo, UpstreamPR } from "./types";

export function normalizePRs(raw: RawSearchPR[], hidden: string[]): UpstreamPR[] {
  const out: UpstreamPR[] = [];
  for (const pr of raw) {
    if (hidden.includes(pr.html_url)) continue;
    const mergedAt = pr.pull_request?.merged_at ?? null;
    let state: UpstreamPR["state"];
    if (mergedAt) state = "merged";
    else if (pr.state === "open") state = "open";
    else continue; // closed without merge
    out.push({
      url: pr.html_url,
      repo: pr.repository_url.replace(/^https:\/\/api\.github\.com\/repos\//, ""),
      title: pr.title,
      state,
      date: mergedAt ?? pr.created_at,
    });
  }
  return out;
}

interface RawRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  homepage: string | null;
  default_branch: string;
}

interface RawRelease {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  created_at: string;
  draft?: boolean;
}

export async function syncGitHub(
  opts: { fetchImpl?: typeof fetch; now?: Date } = {},
): Promise<GitHubData> {
  const { fetchImpl } = opts;
  const user = profile.githubUser;

  const q = encodeURIComponent(`is:pr author:${user} -user:${user}`);
  const search = await ghFetch<{ items: RawSearchPR[] }>(
    `/search/issues?q=${q}&per_page=100&sort=created&order=desc`,
    { fetchImpl },
  );
  const prs = normalizePRs(search.items, profile.hiddenPRs).sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const repos: RepoInfo[] = [];
  const releases: Release[] = [];
  for (const { repo } of profile.showcaseRepos) {
    const base = `/repos/${user}/${repo}`;
    let info: RawRepo;
    try {
      info = await ghFetch<RawRepo>(base, { fetchImpl });
    } catch (err) {
      if (err instanceof GitHubNotFound) {
        console.warn(`Showcase repo ${user}/${repo} not found, skipping`);
        continue;
      }
      throw err;
    }

    let readme: string | null = null;
    try {
      readme = await ghFetch<string>(`${base}/readme`, { raw: true, fetchImpl });
    } catch (err) {
      if (!(err instanceof GitHubNotFound)) throw err;
    }

    let rawReleases: RawRelease[] = [];
    try {
      rawReleases = await ghFetch<RawRelease[]>(`${base}/releases?per_page=5`, { fetchImpl });
    } catch (err) {
      if (!(err instanceof GitHubNotFound)) throw err;
    }

    repos.push({
      name: info.name,
      url: info.html_url,
      description: info.description,
      stars: info.stargazers_count,
      language: info.language,
      topics: info.topics ?? [],
      pushedAt: info.pushed_at,
      homepage: info.homepage || null,
      defaultBranch: info.default_branch,
      readme,
    });
    for (const r of rawReleases) {
      if (r.draft) continue;
      releases.push({
        repo: info.name,
        tag: r.tag_name,
        name: r.name || r.tag_name,
        url: r.html_url,
        date: r.published_at ?? r.created_at,
      });
    }
  }

  return { syncedAt: (opts.now ?? new Date()).toISOString(), prs, repos, releases };
}
