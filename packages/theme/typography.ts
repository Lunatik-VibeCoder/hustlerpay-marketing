// Same system-font stack as the Dashboard (src/app/globals.css) — no new
// web font introduced without a real brand-typography decision.
export const fontFamily = {
  sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const;

interface TypeScale {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
}

export const typography: Record<
  "display" | "h1" | "h2" | "h3" | "body" | "small" | "caption",
  TypeScale
> = {
  display: { fontSize: "3.5rem", lineHeight: "1.1", fontWeight: 700 },
  h1: { fontSize: "2.5rem", lineHeight: "1.15", fontWeight: 700 },
  h2: { fontSize: "1.875rem", lineHeight: "1.2", fontWeight: 600 },
  h3: { fontSize: "1.25rem", lineHeight: "1.3", fontWeight: 600 },
  body: { fontSize: "1rem", lineHeight: "1.6", fontWeight: 400 },
  small: { fontSize: "0.875rem", lineHeight: "1.5", fontWeight: 400 },
  caption: { fontSize: "0.75rem", lineHeight: "1.4", fontWeight: 500 },
};
