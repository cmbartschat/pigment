// Paint-palette color mixing.
// Express a color as a recipe of base colors with integer "parts",
// e.g. "r2b1w1" = 2 parts red + 1 part blue + 1 part white.

export type BaseKey = "r" | "o" | "y" | "g" | "b" | "i" | "v" | "w" | "k"

export interface BaseColor {
  key: BaseKey
  name: string
  hex: string
}

// ROYGBIV + W(hite) + K(ey/black)
export const BASE_COLORS: BaseColor[] = [
  { key: "r", name: "Red", hex: "#e10600" },
  { key: "o", name: "Orange", hex: "#f07300" },
  { key: "y", name: "Yellow", hex: "#fbd000" },
  { key: "g", name: "Green", hex: "#1fa540" },
  { key: "b", name: "Blue", hex: "#1457d6" },
  { key: "i", name: "Indigo", hex: "#3b2e8c" },
  { key: "v", name: "Violet", hex: "#7b2fbe" },
  { key: "w", name: "White", hex: "#ffffff" },
  { key: "k", name: "Black", hex: "#0b0b0d" },
]

export const BASE_BY_KEY: Record<BaseKey, BaseColor> = BASE_COLORS.reduce(
  (acc, c) => {
    acc[c.key] = c
    return acc
  },
  {} as Record<BaseKey, BaseColor>,
)

const VALID_KEYS = new Set(BASE_COLORS.map((c) => c.key))

export type Recipe = Partial<Record<BaseKey, number>>

interface RGB {
  r: number
  g: number
  b: number
}

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "")
  return {
    r: Number.parseInt(h.slice(0, 2), 16),
    g: Number.parseInt(h.slice(2, 4), 16),
    b: Number.parseInt(h.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0")
  return `#${c(r)}${c(g)}${c(b)}`
}

/**
 * Parse a recipe string like "r2b1w1" (case-insensitive).
 * Separators and whitespace are ignored ("r2 b1, w1" is fine).
 * A bare letter counts as 1 part ("rb" === "r1b1").
 */
export function parseRecipe(input: string): Recipe {
  const recipe: Recipe = {}
  const matches = input.toLowerCase().matchAll(/([a-z])\s*(\d*)/g)
  for (const m of matches) {
    const key = m[1] as BaseKey
    if (!VALID_KEYS.has(key)) continue
    const parts = m[2] === "" ? 1 : Number.parseInt(m[2], 10)
    if (parts <= 0) continue
    recipe[key] = (recipe[key] ?? 0) + parts
  }
  return recipe
}

/** Stringify a recipe into the canonical "r2b1w1" format (ROYGBIVWK order). A single part omits the "1". */
export function formatRecipe(recipe: Recipe): string {
  return BASE_COLORS.filter((c) => (recipe[c.key] ?? 0) > 0)
    .map((c) => {
      const parts = recipe[c.key]!
      return parts === 1 ? c.key : `${c.key}${parts}`
    })
    .join("")
}

export function totalParts(recipe: Recipe): number {
  return BASE_COLORS.reduce((sum, c) => sum + (recipe[c.key] ?? 0), 0)
}

/**
 * Mix the recipe by weighted averaging of the base colors in sRGB space.
 * This behaves like paint: adding white lightens, black darkens, and
 * pigments pull the hue toward themselves proportionally to their parts.
 * Returns null if the recipe is empty.
 */
export function mixRecipe(recipe: Recipe): string | null {
  const total = totalParts(recipe)
  if (total === 0) return null
  let r = 0
  let g = 0
  let b = 0
  for (const c of BASE_COLORS) {
    const parts = recipe[c.key] ?? 0
    if (parts === 0) continue
    const rgb = hexToRgb(c.hex)
    r += rgb.r * parts
    g += rgb.g * parts
    b += rgb.b * parts
  }
  return rgbToHex({ r: r / total, g: g / total, b: b / total })
}

/** Relative luminance (0-1) used to pick readable foreground text. */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const lin = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function readableTextColor(hex: string): string {
  return luminance(hex) > 0.42 ? "#0b0b0d" : "#ffffff"
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex)
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0)
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      default:
        h = (rn - gn) / d + 4
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}
