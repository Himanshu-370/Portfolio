import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { syncGitHub } from "../src/lib/github/sync";

const out = fileURLToPath(new URL("../src/data/github-snapshot.json", import.meta.url));

try {
  const data = await syncGitHub();
  await writeFile(out, JSON.stringify(data, null, 2) + "\n");
  console.log(
    `Wrote ${out}: ${data.prs.length} PRs, ${data.repos.length} repos, ${data.releases.length} releases`,
  );
} catch (err) {
  console.error("sync failed:", err);
  process.exit(1);
}
