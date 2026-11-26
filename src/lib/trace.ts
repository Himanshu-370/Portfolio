import type { CareerSpan, YearMonth } from "@/data/profile";

export interface SpanBox {
  id: string;
  leftPct: number;
  widthPct: number;
}

const MIN_WIDTH = 2;

const parse = (ym: YearMonth): [number, number] => {
  const [y, m] = ym.split("-").map(Number) as [number, number];
  return [y, m - 1];
};
const startMs = (ym: YearMonth) => Date.UTC(...parse(ym), 1);
const endMs = (ym: YearMonth) => {
  const [y, m] = parse(ym);
  return Date.UTC(y, m + 1, 1);
};

export function spanGeometry(spans: CareerSpan[], now: Date): SpanBox[] {
  if (spans.length === 0) return [];
  const t0 = Math.min(...spans.map((s) => startMs(s.start)));
  const total = Math.max(now.getTime() - t0, 1);
  return spans.map((s) => {
    const from = startMs(s.start);
    const to = s.end === null ? now.getTime() : Math.min(endMs(s.end), now.getTime());
    const widthPct = Math.min(100, Math.max(MIN_WIDTH, ((to - from) / total) * 100));
    const leftPct = Math.max(0, Math.min(((from - t0) / total) * 100, 100 - widthPct));
    return { id: s.id, leftPct, widthPct };
  });
}
