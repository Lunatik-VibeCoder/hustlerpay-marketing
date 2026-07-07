// Named aliases over Tailwind's own default spacing scale (0.25rem steps) —
// not a competing scale. Use these for component-internal spacing that
// should stay consistent across the Design System; arbitrary Tailwind
// spacing utilities remain fine for one-off layout tweaks.
export const spacing = {
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
} as const;

export type SpacingToken = keyof typeof spacing;
