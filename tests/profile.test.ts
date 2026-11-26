import { describe, expect, test } from "vitest";
import { profile } from "@/data/profile";

describe("profile", () => {
  test("no email in profile", () => {
    const json = JSON.stringify(profile);
    expect(json).not.toMatch(/@[a-z0-9-]+\.[a-z]{2,}/i);
    expect(json).not.toMatch(/mailto:/);
  });

  test("career spans are valid", () => {
    for (const span of profile.career) {
      expect(span.start).toMatch(/^\d{4}-\d{2}$/);
      if (span.end !== null) {
        expect(span.end).toMatch(/^\d{4}-\d{2}$/);
        expect(span.end >= span.start).toBe(true);
      }
    }
    const ids = profile.career.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("achievements reference real spans", () => {
    const ids = new Set(profile.career.map((s) => s.id));
    for (const a of profile.achievements) expect(ids.has(a.spanId)).toBe(true);
  });

  test("slugs unique across showcase + manual", () => {
    const slugs = [
      ...profile.showcaseRepos.map((r) => r.slug ?? r.repo),
      ...profile.manualProjects.map((p) => p.slug),
    ];
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
