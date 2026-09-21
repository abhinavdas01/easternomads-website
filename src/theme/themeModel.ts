export type Control = {
  name: string; label: string; group: string; kind: "color" | "number" | "font";
  unit?: string; min?: number; max?: number; step?: number;
};
export const fonts = ['"Syne", sans-serif', '"Plus Jakarta Sans", sans-serif', 'system-ui, sans-serif', 'Georgia, serif'];
export const controls: Control[] = [
  ...[
    ["brand", "Accent"], ["brand-deep", "Accent hover"], ["on-brand", "Button text"],
    ["ink", "Headings & text"], ["ink-soft", "Body text"], ["muted", "Muted text"],
    ["paper", "Page / navigation"], ["surface", "Cards & panels"],
    ["page-start", "Page gradient start"], ["page-end", "Page gradient end"],
    ["field", "Form fields"], ["hero-text", "Hero text"], ["hero-shade", "Hero overlay"],
    ["shadow-color", "Shadow tint"], ["dark-hover", "Dark button hover"],
    ["portrait-backdrop", "Portrait backdrop"],
  ].map(([name, label]) => ({ name: `--${name}`, label, group: "Colors", kind: "color" as const })),
  { name: "--section-bg", label: "Section background", group: "Colors", kind: "color" },
  ...[
    ["hero-overlay-start", "Hero overlay left", 0, 100, "%", 1],
    ["hero-overlay-middle", "Hero overlay center", 0, 100, "%", 1],
    ["hero-overlay-end", "Hero overlay right", 0, 100, "%", 1],
    ["nav-opacity", "Navigation opacity", 0, 100, "%", 1],
    ["logo-tint", "Tint logos with accent (0 off / 1 on)", 0, 1, "", 1],
    ["max", "Content width", 800, 1600, "px", 20],
    ["radius", "Button / field radius", 0, 32, "px", 1],
    ["nav-radius", "Navigation radius", 0, 32, "px", 1],
    ["base-font-size", "Body base size", 14, 22, "px", 1],
    ["gutter-min", "Minimum page gutter", 0.75, 3, "rem", 0.05],
    ["gutter-max", "Maximum page gutter", 1, 5, "rem", 0.05],
    ["section-space-min", "Minimum section spacing", 2, 8, "rem", 0.25],
    ["section-space-max", "Maximum section spacing", 3, 12, "rem", 0.25],
    ["hero-title-min", "Minimum hero title size", 1.5, 3, "rem", 0.05],
    ["hero-title-max", "Maximum hero title size", 3, 6, "rem", 0.05],
    ["heading-min", "Minimum section title size", 1.25, 3, "rem", 0.05],
    ["heading-max", "Maximum section title size", 2, 5, "rem", 0.05],
  ].map(([name, label, min, max, unit, step]) => ({ name: `--${name}`, label: String(label), group: "Layout & effects", kind: "number" as const, min: Number(min), max: Number(max), unit: String(unit), step: Number(step) })),
  { name: "--font-display", label: "Heading font", group: "Typography", kind: "font" },
  { name: "--font-body", label: "Body font", group: "Typography", kind: "font" },
];
export const scopes = [
  ["global", "Whole website"], ["nav", "Navigation"], ["hero", "Hero"],
  ["audiences", "Who we help"], ["services", "Services"], ["process", "Process"],
  ["solutions", "Solutions & stack"], ["team", "Team"], ["about", "About"],
  ["faq", "FAQ"], ["contact", "Contact"], ["footer", "Footer"],
] as const;
export type Scope = typeof scopes[number][0];
export type Tokens = Record<string, string>;
export type Theme = Partial<Record<Scope, Tokens>>;
export const storageKey = "eastern-nomads-theme-v1";
const scopeIds = new Set<string>(scopes.map(([id]) => id));
const byName = new Map(controls.map(control => [control.name, control]));

export function validValue(control: Control, value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (control.kind === "color") return /^#[\da-f]{6}$/i.test(value);
  if (control.kind === "font") return fonts.includes(value);
  const match = value.match(/^(\d+(?:\.\d+)?)(px|rem|%)?$/);
  if (!match || (match[2] || "") !== control.unit) return false;
  const n = Number(match[1]);
  return Number.isFinite(n) && n >= control.min! && n <= control.max!;
}

/** Untrusted localStorage is restricted to known selectors, properties and values. */
export function sanitizeTheme(input: unknown): Theme {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const result: Theme = {};
  for (const [scope, entries] of Object.entries(input)) {
    if (!scopeIds.has(scope) || !entries || typeof entries !== "object" || Array.isArray(entries)) continue;
    const valid: Tokens = {};
    for (const [name, value] of Object.entries(entries)) {
      const control = byName.get(name);
      if (control && validValue(control, value)) valid[name] = value;
    }
    if (Object.keys(valid).length) result[scope as Scope] = valid;
  }
  return result;
}

export function themeCss(theme: Theme): string {
  const clean = sanitizeTheme(theme);
  return scopes.filter(([scope]) => clean[scope]).map(([scope]) => {
    const selector = scope === "global" ? ":root" : `[data-theme-section="${scope}"]`;
    return `${selector} {\n${Object.entries(clean[scope]!).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `  ${key}: ${value};`).join("\n")}\n}`;
  }).join("\n\n");
}

export const presets: { name: string; tokens: Tokens }[] = [
  { name: "Dark copper", tokens: {} },
  { name: "Cobalt", tokens: { "--brand": "#2459d3", "--brand-deep": "#1743a8", "--on-brand": "#ffffff", "--logo-tint": "1" } },
  { name: "Evergreen", tokens: { "--brand": "#17664d", "--brand-deep": "#104d3a", "--on-brand": "#ffffff", "--paper": "#f3f6f2", "--page-start": "#e9f0e9", "--page-end": "#f8f9f5", "--logo-tint": "1" } },
  { name: "Plum", tokens: { "--brand": "#743ba6", "--brand-deep": "#55297d", "--on-brand": "#ffffff", "--paper": "#f7f4f9", "--page-start": "#eee9f2", "--page-end": "#faf7fa", "--logo-tint": "1" } },
  { name: "Graphite", tokens: { "--brand": "#343b45", "--brand-deep": "#171c24", "--on-brand": "#ffffff", "--logo-tint": "1" } },
  { name: "Midnight orange", tokens: { "--brand": "#ff9858", "--brand-deep": "#ffb27d", "--on-brand": "#171c24", "--ink": "#f1f3f7", "--ink-soft": "#d0d5df", "--muted": "#aeb6c6", "--paper": "#171c24", "--surface": "#202733", "--page-start": "#11151b", "--page-end": "#191d25", "--field": "#171c24", "--dark-hover": "#dce2ed", "--logo-tint": "1" } },
];

export function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const c = hex.slice(1).match(/../g)!.map(x => parseInt(x, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
