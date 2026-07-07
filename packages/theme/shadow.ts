// Dark-first elevation scale — plain black shadows read as barely-visible
// on a near-black background, so these lean on subtle light borders more
// than heavy drop-shadows. `glow` is the one deliberately branded shadow
// (lime, matches --primary), for emphasis on a hero CTA or a highlighted
// card — used sparingly, not the default card shadow.
export const shadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)",
  glow: "0 0 24px 0 rgb(197 255 65 / 0.25)",
} as const;

export type ShadowToken = keyof typeof shadow;
