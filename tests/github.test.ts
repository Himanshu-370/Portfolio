import { afterEach, describe, expect, it, vi } from "vitest";
import { ghFetch, GitHubNotFound } from "@/lib/github/client";
import { normalizePRs, syncGitHub } from "@/lib/github/sync";
import { loadGitHubData } from "@/lib/github/load";
import type { GitHubData, RawSearchPR } from "@/lib/github/types";

const raw = (over: Partial<RawSearchPR> & { merged_at?: string | null }): RawSearchPR => ({
  html_url: "https://github.com/kubevela/kubevela/pull/1",
  title: "t",
  state: "open",
  created_at: "2026-11-01T00:00:00Z",
  repository_url: "https://api.github.com/repos/kubevela/kubevela",
  pull_request: { merged_at: over.merged_at ?? null },
  ...over,
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.GITHUB_TOKEN;
});

describe("normalizePRs", () => {
  it("keeps open and merged, drops closed-unmerged", () => {
    const out = normalizePRs(
      [
        raw({ html_url: "https://github.com/kubevela/kubevela/pull/1" }),
        raw({
          html_url: "https://github.com/kubevela/kubevela/pull/2",
          state: "closed",
          merged_at: "2026-11-20T10:00:00Z",
        }),
        raw({ html_url: "https://github.com/kubevela/kubevela/pull/3", state: "closed" }),
      ],
      [],
    );
    expect(out.map((p) => p.state).sort()).toEqual(["merged", "open"]);
    const merged = out.find((p) => p.state === "merged")!;
    expect(merged.date).toBe("2026-11-20T10:00:00Z");
    expect(merged.repo).toBe("kubevela/kubevela");
  });

  it("drops hiddenPRs by url", () => {
    const out = normalizePRs(
      [raw({ html_url: "https://github.com/a/b/pull/1" }), raw({ html_url: "https://github.com/a/b/pull/2" })],
      ["https://github.com/a/b/pull/1"],
    );
    expect(out.map((p) => p.url)).toEqual(["https://github.com/a/b/pull/2"]);
  });
});

function stub(handler: (path: string, accept: string) => Response) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const path = String(input).replace("https://api.github.com", "");
    const accept = (init?.headers as Record<string, string>)?.Accept ?? "";
    return handler(path, accept);
  }) as unknown as typeof fetch;
}

const repoBody = (name: string) => ({
  name,
  html_url: `https://github.com/Himanshu-370/${name}`,
  description: "d",
  stargazers_count: 3,
  language: "TypeScript",
  topics: ["x"],
  pushed_at: "2026-11-01T00:00:00Z",
  homepage: "",
  default_branch: "main",
});

describe("syncGitHub", () => {
  it("skips a 404 showcase repo", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchImpl = stub((p) => {
      if (p.startsWith("/search/issues")) return json({ items: [] });
      if (p === "/repos/Himanshu-370/cloudwire") return json({ message: "Not Found" }, 404);
      if (p === "/repos/Himanshu-370/son-of-anton") return json(repoBody("son-of-anton"));
      if (p.includes("/readme")) return new Response("# hi", { status: 200 });
      if (p.includes("/releases")) return json([]);
      return json({}, 404);
    });
    const data = await syncGitHub({ fetchImpl });
    expect(data.repos.map((r) => r.name)).toEqual(["son-of-anton"]);
    expect(data.repos[0].homepage).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("sets readme null when /readme 404s", async () => {
    const fetchImpl = stub((p) => {
      if (p.startsWith("/search/issues")) return json({ items: [] });
      if (/^\/repos\/Himanshu-370\/[^/]+$/.test(p)) return json(repoBody(p.split("/").pop()!));
      if (p.includes("/readme")) return json({ message: "Not Found" }, 404);
      if (p.includes("/releases")) return json([]);
      return json({}, 404);
    });
    const data = await syncGitHub({ fetchImpl, now: new Date("2026-11-26T00:00:00Z") });
    expect(data.repos.length).toBe(2);
    expect(data.repos.every((r) => r.readme === null)).toBe(true);
    expect(data.syncedAt).toBe("2026-11-26T00:00:00.000Z");
  });
});

describe("ghFetch", () => {
  it("sends Authorization only when GITHUB_TOKEN set", async () => {
    const seen: Record<string, string>[] = [];
    const fetchImpl = vi.fn(async (_u: RequestInfo | URL, init?: RequestInit) => {
      seen.push(init?.headers as Record<string, string>);
      return json({});
    }) as unknown as typeof fetch;
    await ghFetch("/x", { fetchImpl });
    process.env.GITHUB_TOKEN = "test-token";
    await ghFetch("/x", { fetchImpl });
    expect(seen[0].Authorization).toBeUndefined();
    expect(seen[1].Authorization).toBe("Bearer test-token");
    expect(seen[0]["X-GitHub-Api-Version"]).toBe("2022-11-28");
  });

  it("maps 404 to GitHubNotFound and other errors to Error with status", async () => {
    await expect(ghFetch("/x", { fetchImpl: stub(() => json({}, 404)) })).rejects.toBeInstanceOf(GitHubNotFound);
    await expect(ghFetch("/x", { fetchImpl: stub(() => json({}, 403)) })).rejects.toThrow(/403/);
  });
});

describe("loadGitHubData", () => {
  const snapshot: GitHubData = { syncedAt: "2026-01-01T00:00:00.000Z", prs: [], repos: [], releases: [] };

  it("falls back to snapshot on error", async () => {
    const warn = vi.fn();
    const out = await loadGitHubData({
      sync: () => Promise.reject(new Error("GitHub API 403")),
      snapshot,
      warn,
    });
    expect(out).toBe(snapshot);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("GitHub sync failed, using snapshot");
  });

  it("returns live data when sync succeeds", async () => {
    const live = { ...snapshot, syncedAt: "2026-11-26T00:00:00.000Z" };
    expect(await loadGitHubData({ sync: async () => live, snapshot, warn: vi.fn() })).toBe(live);
  });
});
