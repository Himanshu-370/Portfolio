import { describe, expect, it } from "vitest";
import { profile as realProfile } from "@/data/profile";
import type { Profile } from "@/data/profile";
import type { GitHubData, RepoInfo } from "@/lib/github/types";
import { buildProjects } from "@/lib/projects";
import { filterEvents, toEvents } from "@/lib/events";
import { computeStats } from "@/lib/stats";
import { spanGeometry } from "@/lib/trace";

const now = new Date("2026-11-26T00:00:00Z");
const day = 86400000;
const ago = (d: number) => new Date(now.getTime() - d * day).toISOString();

const repo = (over: Partial<RepoInfo> = {}): RepoInfo => ({
  name: "cloudwire",
  url: "https://github.com/Himanshu-370/cloudwire",
  description: "repo description",
  stars: 7,
  language: "TypeScript",
  topics: [],
  pushedAt: ago(10),
  homepage: null,
  defaultBranch: "main",
  readme: "# Hello",
  ...over,
});

const data = (over: Partial<GitHubData> = {}): GitHubData => ({
  syncedAt: now.toISOString(),
  prs: [],
  repos: [repo()],
  releases: [],
  ...over,
});

const profile: Profile = {
  ...realProfile,
  showcaseRepos: [
    { repo: "cloudwire", stack: ["ts"] },
    { repo: "ghost", stack: [] },
  ],
  manualProjects: [
    { slug: "old", name: "Old", summary: "s", stack: [], year: "2021", archived: true, body: "body", },
    { slug: "newer", name: "Newer", summary: "s", stack: [], year: "2022", archived: false, body: "body" },
  ],
};

describe("buildProjects", () => {
  it("omits showcase repo missing from data", () => {
    const slugs = buildProjects(profile, data(), now).map((p) => p.slug);
    expect(slugs).not.toContain("ghost");
    expect(slugs[0]).toBe("cloudwire");
  });

  it("still returns manual projects", () => {
    const ps = buildProjects(profile, data({ repos: [] }), now);
    expect(ps.map((p) => p.slug)).toEqual(["old", "newer"]);
    expect(ps[0]).toMatchObject({ status: "archived", meta: "archived", live: false });
    expect(ps[1]).toMatchObject({ status: "idle", meta: "2022" });
  });

  it("override summary wins over repo description", () => {
    const p = {
      ...profile,
      showcaseRepos: [{ repo: "cloudwire", stack: [], override: { summary: "mine" } }],
    };
    expect(buildProjects(p, data(), now)[0]!.summary).toBe("mine");
    expect(buildProjects(profile, data(), now)[0]!.summary).toBe("repo description");
  });

  it("README null and no override gives empty bodyHtml", () => {
    const d = data({ repos: [repo({ readme: null })] });
    expect(buildProjects(profile, d, now)[0]!.bodyHtml).toBe("");
  });

  it("override body wins over README", () => {
    const p = {
      ...profile,
      showcaseRepos: [{ repo: "cloudwire", stack: [], override: { body: "# Override Title" } }],
    };
    const html = buildProjects(p, data(), now)[0]!.bodyHtml;
    expect(html).toContain("Override Title");
    expect(html).not.toContain("Hello");
  });

  it("status active when pushed 10 days ago, idle when 200 days ago", () => {
    expect(buildProjects(profile, data(), now)[0]!.status).toBe("active");
    const d = data({ repos: [repo({ pushedAt: ago(200) })] });
    expect(buildProjects(profile, d, now)[0]!.status).toBe("idle");
  });

  it("uses live metadata", () => {
    expect(buildProjects(profile, data(), now)[0]).toMatchObject({
      meta: "★7",
      live: true,
      language: "TypeScript",
      images: [],
    });
  });
});

describe("project meta", () => {
  it("shows updated month when stars are zero", () => {
    const d = data({ repos: [repo({ stars: 0, pushedAt: "2026-11-16T00:00:00Z" })] });
    expect(buildProjects(profile, d, now)[0]!.meta).toBe("updated Nov 2026");
  });
});

describe("events", () => {
  const d = data({
    prs: [
      { url: "u1", repo: "a/b", title: "merged pr", state: "merged", date: "2026-11-10T00:00:00Z" },
      { url: "u2", repo: "c/d", title: "open pr", state: "open", date: "2026-11-01T00:00:00Z" },
    ],
    releases: [{ repo: "Himanshu-370/cloudwire", tag: "v1", name: "v1", url: "u3", date: "2026-11-20T00:00:00Z" }],
  });

  it("toEvents merges PRs and releases newest first with correct levels", () => {
    const e = toEvents(d);
    expect(e.map((x) => x.level)).toEqual(["RELEASE", "MERGED", "OPEN"]);
    expect(e[0]).toMatchObject({ url: "u3", repo: "Himanshu-370/cloudwire" });
  });

  it("filterEvents 30d excludes a 40-day-old event", () => {
    const e = [
      { date: ago(40), level: "MERGED" as const, repo: "a/b", title: "x", url: "1" },
      { date: ago(5), level: "MERGED" as const, repo: "a/b", title: "y", url: "2" },
    ];
    expect(filterEvents(e, "30d", "all", now).map((x) => x.url)).toEqual(["2"]);
    expect(filterEvents(e, "1y", "all", now)).toHaveLength(2);
  });

  it("filterEvents includes the exact boundary", () => {
    const e = [{ date: ago(30), level: "OPEN" as const, repo: "a/b", title: "x", url: "1" }];
    expect(filterEvents(e, "30d", "all", now)).toHaveLength(1);
  });

  it("filterEvents all/MERGED returns only merged", () => {
    const out = filterEvents(toEvents(d), "all", "MERGED", now);
    expect(out.map((x) => x.level)).toEqual(["MERGED"]);
  });

  it("filterEvents applies range and kind together", () => {
    const e = [
      { date: ago(40), level: "MERGED" as const, repo: "a/b", title: "old merged", url: "1" },
      { date: ago(5), level: "OPEN" as const, repo: "a/b", title: "recent open", url: "2" },
      { date: ago(5), level: "MERGED" as const, repo: "a/b", title: "recent merged", url: "3" },
    ];
    expect(filterEvents(e, "30d", "MERGED", now).map((x) => x.url)).toEqual(["3"]);
  });

  it("filterEvents on [] returns []", () => {
    expect(filterEvents([], "30d", "all", now)).toEqual([]);
  });
});

describe("computeStats", () => {
  it("computes years, PR counts and manual stats", () => {
    const d = data({
      prs: [
        { url: "1", repo: "kubevela/kubevela", title: "a", state: "merged", date: ago(5) },
        { url: "2", repo: "kubevela/kubevela", title: "b", state: "open", date: ago(5) },
        { url: "3", repo: "confident-ai/deepeval", title: "c", state: "open", date: ago(5) },
      ],
    });
    const stats = computeStats({ ...realProfile, careerStart: "2024-01" }, d, now);
    expect(stats[0]).toEqual({ value: "2.9y", label: "in industry" });
    expect(stats[1]).toEqual({ value: "1", label: "upstream PRs merged" });
    expect(stats[2]).toEqual({ value: "2", label: "OSS projects contributed to" });
    expect(stats.at(-1)!.value).toBe("50+");
  });
});

describe("spanGeometry", () => {
  const boxes = spanGeometry(realProfile.career, now);
  it("open-ended span ends at 100%", () => {
    const gw = boxes.find((b) => b.id === "guidewire")!;
    expect(gw.leftPct + gw.widthPct).toBeCloseTo(100, 5);
  });
  it("short span has width at least 2", () => {
    expect(boxes.find((b) => b.id === "hyperswitch")!.widthPct).toBeGreaterThanOrEqual(2);
  });
  it("returns one box per span within bounds", () => {
    expect(boxes).toHaveLength(realProfile.career.length);
    for (const b of boxes) {
      expect(b.leftPct).toBeGreaterThanOrEqual(0);
      expect(b.leftPct + b.widthPct).toBeLessThanOrEqual(100 + 1e-9);
    }
  });
  it("clamps a span ending in the current month to now", () => {
    const spans = [
      { ...realProfile.career[0]!, id: "a", start: "2024-01" as const, end: "2024-02" as const },
      { ...realProfile.career[0]!, id: "b", start: "2025-01" as const, end: "2026-11" as const },
    ];
    const b = spanGeometry(spans, now).find((x) => x.id === "b")!;
    expect(b.leftPct + b.widthPct).toBeCloseTo(100, 5);
    const t0 = Date.UTC(2024, 0, 1);
    const expectedLeft = ((Date.UTC(2025, 0, 1) - t0) / (now.getTime() - t0)) * 100;
    expect(b.leftPct).toBeCloseTo(expectedLeft, 5);
  });
  it("empty spans give empty result", () => {
    expect(spanGeometry([], now)).toEqual([]);
  });
});
