// Mirrors the Dashboard's own convention exactly (--radius: 0.5rem, sm/md
// derived by subtracting) — src/styles/theme.css.
export const radius = {
  sm: "0.25rem", // calc(0.5rem - 4px)
  md: "0.375rem", // calc(0.5rem - 2px)
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
} as const;

export type RadiusToken = keyof typeof radius;
