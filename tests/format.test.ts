import { describe, expect, it } from "vitest";
import { formatMonth, formatPeriod, formatSyncedAt } from "@/lib/format";

describe("formatSyncedAt", () => {
  it("formats a UTC timestamp", () => {
    expect(formatSyncedAt("2026-11-26T18:00:00Z")).toBe("26 Nov 2026, 18:00 UTC");
  });
  it("zero-pads day and time", () => {
    expect(formatSyncedAt("2026-11-05T09:05:00Z")).toBe("05 Nov 2026, 09:05 UTC");
  });
});

describe("formatPeriod", () => {
  it("formats months and Present", () => {
    expect(formatMonth("2024-01")).toBe("Jan 2024");
    expect(formatMonth("2024-09")).toBe("Sep 2024");
    expect(formatPeriod("2024-01", null)).toBe("Jan 2024 – Present");
    expect(formatPeriod("2022-10", "2023-10")).toBe("Oct 2022 – Oct 2023");
  });
});
