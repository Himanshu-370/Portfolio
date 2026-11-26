import snapshotJson from "@/data/github-snapshot.json";
import { syncGitHub } from "./sync";
import type { GitHubData } from "./types";

export async function loadGitHubData(
  opts: {
    sync?: () => Promise<GitHubData>;
    snapshot?: GitHubData;
    warn?: (msg: string) => void;
  } = {},
): Promise<GitHubData> {
  const sync = opts.sync ?? (() => syncGitHub());
  const snapshot = opts.snapshot ?? (snapshotJson as GitHubData);
  const warn = opts.warn ?? console.warn;
  try {
    return await sync();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    warn(`GitHub sync failed, using snapshot: ${msg}`);
    return snapshot;
  }
}
