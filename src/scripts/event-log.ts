import { filterEvents, type Level, type LogEvent, type Range } from "@/lib/events";

type Kind = "all" | Level;

const dataEl = document.getElementById("event-data");
const list = document.querySelector<HTMLElement>("[data-events]");
const empty = document.querySelector<HTMLElement>("[data-empty]");

if (dataEl?.textContent && list && empty) {
  const events: LogEvent[] = JSON.parse(dataEl.textContent);
  const items = Array.from(list.querySelectorAll<HTMLElement>("li[data-index]"));
  const rangeBtns = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-range]"));
  const kindBtns = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-kind]"));

  let range: Range = "all";
  let kind: Kind = "all";

  const render = () => {
    const visible = new Set(filterEvents(events, range, kind, new Date()));
    let count = 0;
    for (const li of items) {
      const show = visible.has(events[Number(li.dataset.index)]);
      li.hidden = !show;
      if (show) count++;
    }
    empty.hidden = count > 0;
  };

  const bind = (btns: HTMLButtonElement[], attr: "range" | "kind", set: (v: string) => void) => {
    for (const b of btns) {
      b.addEventListener("click", () => {
        for (const o of btns) o.setAttribute("aria-pressed", String(o === b));
        set(b.dataset[attr] as string);
        render();
      });
    }
  };
  bind(rangeBtns, "range", (v) => (range = v as Range));
  bind(kindBtns, "kind", (v) => (kind = v as Kind));
  render();
}
