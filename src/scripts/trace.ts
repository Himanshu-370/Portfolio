interface TraceItem {
  id: string;
  role: string;
  org: string;
  period: string;
  location: string;
  metrics: string[];
  bullets: string[];
  achievements: string[];
}

const dataEl = document.getElementById("trace-data");
const panel = document.getElementById("trace-detail");

let items: TraceItem[] | null = null;
try {
  items = dataEl?.textContent ? (JSON.parse(dataEl.textContent) as TraceItem[]) : null;
} catch {
  items = null; // keep the server-rendered panel
}

if (items && panel) {
  const byId = new Map(items.map((i) => [i.id, i]));
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-span]"));

  const el = (tag: string, cls?: string, text?: string) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };

  const render = (i: TraceItem) => {
    const frag = document.createDocumentFragment();
    frag.append(el("h3", "role", i.role));
    frag.append(el("p", "meta muted", `${i.org} · ${i.period} · ${i.location}`));
    if (i.metrics.length) {
      const m = el("p", "metrics");
      for (const t of i.metrics) m.append(el("span", "tag", t), " ");
      frag.append(m);
    }
    if (i.bullets.length) {
      const ul = el("ul", "bullets");
      for (const b of i.bullets) ul.append(el("li", undefined, b));
      frag.append(ul);
    }
    if (i.achievements.length) {
      frag.append(el("h4", "label", "Achievements"));
      const ul = el("ul", "bullets");
      for (const a of i.achievements) ul.append(el("li", undefined, a));
      frag.append(ul);
    }
    panel.replaceChildren(frag);
  };

  for (const b of buttons) {
    b.addEventListener("click", () => {
      const item = byId.get(b.dataset.span ?? "");
      if (!item) return;
      for (const o of buttons) o.setAttribute("aria-pressed", String(o === b));
      render(item);
    });
  }
}
