import { describe, expect, it } from "vitest";
import { parseStoredTheme, resolveTheme, toggleTheme } from "@/lib/theme";

describe("theme", () => {
  it("parseStoredTheme accepts only light or dark", () => {
    expect(parseStoredTheme("light")).toBe("light");
    expect(parseStoredTheme("dark")).toBe("dark");
    expect(parseStoredTheme("blue")).toBeNull();
    expect(parseStoredTheme(null)).toBeNull();
  });

  it("resolveTheme prefers the stored choice over the system setting", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("resolveTheme falls back to the system setting", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("toggleTheme flips between light and dark", () => {
    expect(toggleTheme("light")).toBe("dark");
    expect(toggleTheme("dark")).toBe("light");
  });
});
