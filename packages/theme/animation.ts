// Plain CSS transition tokens — no animation library dependency (the
// Dashboard doesn't use one either; Framer Motion is TGA's choice, not
// adopted here without a concrete need, per the "TGA is inspiration,
// never a dependency" rule). Introduce a real animation lib only if
// WEB-CALC-2's Calculator tabs genuinely need it.
export const duration = {
  fast: "150ms",
  base: "250ms",
  slow: "400ms",
} as const;

export const easing = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

export type DurationToken = keyof typeof duration;
export type EasingToken = keyof typeof easing;
