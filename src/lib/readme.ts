import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export interface RepoRef {
  owner: string;
  name: string;
  branch: string;
}

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function isAbsolute(url: string): boolean {
  return SCHEME.test(url) || url.startsWith("//");
}

/** Single source of truth for turning a README-relative URL into a GitHub URL. */
export function resolveRepoUrl(url: string, kind: "img" | "link", repo: RepoRef): string {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("#") || isAbsolute(trimmed)) return url;

  const suffixAt = trimmed.search(/[?#]/);
  const path = suffixAt === -1 ? trimmed : trimmed.slice(0, suffixAt);
  const suffix = suffixAt === -1 ? "" : trimmed.slice(suffixAt);

  const parts: string[] = [];
  for (const seg of path.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") parts.pop(); // clamped at repo root
    else parts.push(seg);
  }

  const base =
    kind === "img"
      ? `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/`
      : `https://github.com/${repo.owner}/${repo.name}/blob/${repo.branch}/`;
  return base + parts.join("/") + suffix;
}

/** Rewrites relative URLs in markdown `![]()`, `[]()` and raw `<img src>` occurrences. */
export function rewriteReadmeUrls(md: string, repo: RepoRef): string {
  return md
    .replace(
      /(!?)\[([^[\]]*)\]\(\s*([^)\s]+)((?:\s+"[^"]*")?)\s*\)/g,
      (_m, bang: string, text: string, url: string, title: string) =>
        `${bang}[${text}](${resolveRepoUrl(url, bang ? "img" : "link", repo)}${title})`,
    )
    .replace(
      /(<img\b[^>]*?\bsrc\s*=\s*)(["'])(.*?)\2/gi,
      (_m, head: string, q: string, url: string) => `${head}${q}${resolveRepoUrl(url, "img", repo)}${q}`,
    );
}

function rewriteSrcset(srcset: string, repo: RepoRef): string {
  return srcset
    .split(",")
    .map((entry) => {
      const [url, ...descriptor] = entry.trim().split(/\s+/);
      return [resolveRepoUrl(url ?? "", "img", repo), ...descriptor].join(" ");
    })
    .join(", ");
}

/** Markdown (GFM) to sanitized HTML with working image and link URLs. */
export function renderReadme(md: string, repo: RepoRef): string {
  const html = marked.parse(md, { gfm: true, async: false });
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "details",
      "summary",
      "picture",
      "source",
    ],
    allowedAttributes: {
      img: ["src", "alt", "width", "height"],
      a: ["href", "title", "target", "rel"],
      source: ["srcset", "media"],
    },
    allowedSchemes: ["http", "https"],
    transformTags: {
      img: (tagName, attribs) => {
        if (attribs.src) attribs.src = resolveRepoUrl(attribs.src, "img", repo);
        return { tagName, attribs };
      },
      source: (tagName, attribs) => {
        if (attribs.srcset) attribs.srcset = rewriteSrcset(attribs.srcset, repo);
        return { tagName, attribs };
      },
      a: (tagName, attribs) => {
        delete attribs.target;
        delete attribs.rel;
        if (attribs.href) {
          attribs.href = resolveRepoUrl(attribs.href, "link", repo);
          if (isAbsolute(attribs.href)) {
            attribs.target = "_blank";
            attribs.rel = "noopener";
          }
        }
        return { tagName, attribs };
      },
    },
  });
}
