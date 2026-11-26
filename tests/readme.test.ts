import { describe, expect, it } from "vitest";
import { renderReadme, resolveRepoUrl, rewriteReadmeUrls } from "@/lib/readme";

const repo = { owner: "Himanshu-370", name: "cloudwire", branch: "main" };
const RAW = "https://raw.githubusercontent.com/Himanshu-370/cloudwire/main/";
const BLOB = "https://github.com/Himanshu-370/cloudwire/blob/main/";

describe("renderReadme", () => {
  it("rewrites markdown images", () => {
    expect(renderReadme("![a](./docs/shot.png)", repo)).toContain(`${RAW}docs/shot.png`);
  });
  it("rewrites raw img and keeps width", () => {
    const html = renderReadme('<img src="docs/demo.gif" width="400">', repo);
    expect(html).toContain(`${RAW}docs/demo.gif`);
    expect(html).toContain('width="400"');
  });
  it("rewrites relative links with blank target", () => {
    const html = renderReadme("[guide](CONTRIBUTING.md)", repo);
    expect(html).toContain(`href="${BLOB}CONTRIBUTING.md"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener"');
  });
  it("leaves anchors and absolute images unchanged", () => {
    const a = renderReadme("[x](#install)", repo);
    expect(a).toContain('href="#install"');
    expect(a).not.toContain("target=");
    expect(renderReadme("![b](https://img.shields.io/badge/x)", repo)).toContain(
      'src="https://img.shields.io/badge/x"',
    );
  });
  it("marks absolute links external", () => {
    const html = renderReadme("[e](https://example.com/x)", repo);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener"');
  });
  it("strips dangerous content", () => {
    const html = renderReadme(
      '<script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">y</a>',
      repo,
    );
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("javascript:");
  });
  it("renders GFM tables", () => {
    expect(renderReadme("|a|b|\n|-|-|\n|1|2|", repo)).toContain("<table>");
  });
  it("keeps details/summary and rewrites picture source srcset", () => {
    const html = renderReadme(
      '<details><summary>s</summary>x</details><picture><source srcset="a/b.png" media="(prefers-color-scheme: dark)"><img src="a/c.png"></picture>',
      repo,
    );
    expect(html).toContain("<details>");
    expect(html).toContain(`srcset="${RAW}a/b.png"`);
  });
});

describe("review fixes", () => {
  it("adds no target to links with disallowed schemes", () => {
    const html = renderReadme("[x](javascript:alert(1))", repo);
    expect(html).toContain("<a");
    expect(html).not.toContain("target=");
    expect(html).not.toContain("javascript:");
  });
  it("does not split srcset on commas inside a URL", () => {
    const html = renderReadme('<picture><source srcset="a,b/c.png 1x"></picture>', repo);
    expect(html).toContain(`srcset="${RAW}a,b/c.png 1x"`);
  });
});

describe("resolveRepoUrl", () => {
  it("clamps ../ at repo root", () => {
    expect(resolveRepoUrl("../../x.png", "img", repo)).toBe(`${RAW}x.png`);
  });
  it("keeps query and fragment", () => {
    expect(resolveRepoUrl("docs/a.png?raw=true", "img", repo)).toBe(`${RAW}docs/a.png?raw=true`);
    expect(resolveRepoUrl("docs/a.md#top", "link", repo)).toBe(`${BLOB}docs/a.md#top`);
  });
  it("leaves absolute, protocol-relative, anchor and mailto as-is", () => {
    for (const u of ["https://a.b/c", "//a.b/c", "#x", "mailto:a@b.c"]) {
      expect(resolveRepoUrl(u, "link", repo)).toBe(u);
    }
  });
  it("treats leading slash as repo-root path", () => {
    expect(resolveRepoUrl("/docs/a.png", "img", repo)).toBe(`${RAW}docs/a.png`);
  });
});

describe("rewriteReadmeUrls", () => {
  it("rewrites markdown images, links and img src", () => {
    const out = rewriteReadmeUrls(
      '![a](./i.png) [l](x/y.md) <img src="z.png"> [h](#a) ![r](https://e.com/i.png)',
      repo,
    );
    expect(out).toContain(`![a](${RAW}i.png)`);
    expect(out).toContain(`[l](${BLOB}x/y.md)`);
    expect(out).toContain(`<img src="${RAW}z.png">`);
    expect(out).toContain("[h](#a)");
    expect(out).toContain("![r](https://e.com/i.png)");
  });
});
