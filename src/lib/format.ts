const dateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** "2026-11-26T18:00:00Z" -> "26 Nov 2026, 18:00 UTC" */
export function formatSyncedAt(iso: string): string {
  const p: Record<string, string> = {};
  for (const part of dateTime.formatToParts(new Date(iso))) p[part.type] = part.value;
  const hour = p.hour === "24" ? "00" : p.hour;
  return `${p.day} ${p.month} ${p.year}, ${hour}:${p.minute} UTC`;
}

const monthFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", month: "short", year: "numeric" });

/** "2024-01" -> "Jan 2024" */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number) as [number, number];
  return monthFmt.format(new Date(Date.UTC(y, m - 1, 1))).replace(/^(\w+)\s/, "$1 ");
}

export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
