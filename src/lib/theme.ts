export type Theme = "light" | "dark";

/** localStorage key for the visitor's explicit choice. */
export const THEME_STORAGE_KEY = "theme";

/** Event dispatched on window after the theme changes; detail is the new Theme. */
export const THEME_CHANGE_EVENT = "themechange";

export function parseStoredTheme(value: string | null): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

export function resolveTheme(stored: Theme | null, systemDark: boolean): Theme {
  return stored ?? (systemDark ? "dark" : "light");
}

export function toggleTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}
