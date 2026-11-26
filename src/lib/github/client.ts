const BASE = "https://api.github.com";

export class GitHubNotFound extends Error {}

export async function ghFetch<T>(
  path: string,
  opts: { raw?: boolean; fetchImpl?: typeof fetch } = {},
): Promise<T> {
  const doFetch = opts.fetchImpl ?? globalThis.fetch;
  const headers: Record<string, string> = {
    Accept: opts.raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await doFetch(`${BASE}${path}`, { headers });
  if (res.status === 404) throw new GitHubNotFound(`GitHub 404: ${path}`);
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${path}`);
  return (opts.raw ? await res.text() : await res.json()) as T;
}
