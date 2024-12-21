export const themeKeys = [
  "primary",
  "on-primary",
  "tertiary", "on-tertiary",
  "surface", "on-surface",
  "error", "on-error",
  "outline", "outline-variant",
  "primary-container", "on-primary-container",
  "secondary", "on-secondary",
  "tertiary-container", "on-tertiary-container",
  "error-container", "on-error-container",
  "surface-dim", "surface-bright", "surface-variant",
  "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest",
  "primary-fixed", "on-primary-fixed", "primary-fixed-dim",
  "secondary-fixed", "on-secondary-fixed", "secondary-fixed-dim",
  "tertiary-fixed", "on-tertiary-fixed", "tertiary-fixed-dim",
] as const;

export interface InputColor {
  r: number;
  g: number;
  b: number,
  a: number;
  roundA: number;
  hex: string;
  rgba: string;
}

export type Theme = Record<typeof themeKeys[number], any>

