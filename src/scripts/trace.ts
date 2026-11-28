interface TraceItem {
  id: string;
  role: string;
  org: string;
  period: string;
  location: string;
  metrics: string[];
  bullets: string[];
  summary?: string;
  roles?: {
    title: string;
    period: string;
    writeups?: { title: string; paragraphs: string[] }[];
  }[];
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
    const appendBullets = (bullets: string[]) => {
      if (!bullets.length) return;
      const list = el("ul", "bullets");
      for (const bullet of bullets) list.append(el("li", undefined, bullet));
      frag.append(list);
    };
    if (i.summary) frag.append(el("p", "writeup-copy", i.summary));
    for (const role of i.roles ?? []) {
      frag.append(el("h4", "label", role.title), el("p", "meta muted", role.period));
      for (const { title, paragraphs } of role.writeups ?? []) {
        const section = el("section", "writeup");
        section.append(el("h5", undefined, title));
        for (const paragraph of paragraphs) section.append(el("p", "writeup-copy", paragraph));
        frag.append(section);
      }
    }
    if (i.roles?.length && i.bullets.length) {
      frag.append(el("h4", "label", "Other Guidewire work"));
    }
    appendBullets(i.bullets);
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
