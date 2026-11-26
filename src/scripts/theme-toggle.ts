import {
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  parseStoredTheme,
  resolveTheme,
  toggleTheme,
  type Theme,
} from "@/lib/theme";

const root = document.documentElement;
const media = window.matchMedia("(prefers-color-scheme: dark)");

function readStored(): Theme | null {
  try {
    return parseStoredTheme(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

function apply(theme: Theme): void {
  root.dataset.theme = theme;
  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  if (button) {
    const next = toggleTheme(theme);
    button.setAttribute("aria-label", `Switch to ${next} theme`);
    button.title = `Switch to ${next} theme`;
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
}

apply(resolveTheme(readStored(), media.matches));

const toggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
if (toggle) {
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    const next = toggleTheme(resolveTheme(parseStoredTheme(root.dataset.theme ?? null), media.matches));
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this page view only */
    }
    apply(next);
  });
}

// Follow live OS changes until the visitor makes an explicit choice.
media.addEventListener("change", (e) => {
  if (!readStored()) apply(e.matches ? "dark" : "light");
});
