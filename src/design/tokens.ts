/**
 * 🎨 Design Tokens — Single source of truth for the whole website.
 *
 * Everything visual (colors, fonts, sizes, spacing, shadows, radii) is defined here.
 * Edit values in this file to re-skin the entire site — `tailwind.config.ts` imports
 * from this module so any change flows automatically into Tailwind utilities.
 *
 * Naming convention:
 *   - `brand.*`    → fixed brand palette (yellow, accent green, warm terracotta…)
 *   - `bg / card`  → page and surface backgrounds, with `-2` / `-3` as deeper layers
 *   - `ink`        → text colors (main / muted / soft)
 *   - `line`       → borders and hairline separators
 *   - `font.*`     → font families + size scale
 *   - `radius`     → corner radii scale
 *   - `shadow`     → elevation shadows
 *
 * Each color token has `.light` and `.dark` variants. Tailwind generates
 * `bg-card-light dark:bg-card-dark` style utilities from these.
 */

// ============================================================
// 🎨 COLORS
// ============================================================
export const colors = {
  // ---------- Brand (fixed across light/dark) ----------
  brand: {
    yellow: '#f3d77a',         // softer cream-yellow (was #f5cb5c)
    accent: '#4f772d',         // primary action green (light theme)
    'accent-bright': '#6b9c3d', // primary action green (dark theme)
    warm: '#c95a3c',           // deeper, more confident terracotta (was #e07a5f)
    'warm-bright': '#dd7a5a',  // for dark mode
    pink: '#e198ac',           // secondary accent
  },

  // ---------- Page backgrounds (the canvas behind cards) ----------
  bg: {
    light: '#f7f4ef',          // warm cream (was #f8f6f3)
    dark: '#131317',           // deeper near-black (was #1c1d24)
  },

  // ---------- Card surfaces (3 stacked layers) ----------
  card: {
    light: '#ffffff',
    dark: '#1d1d22',
  },
  'card-2': {
    light: '#faf7f2',          // warm cream tint (was #fafafa)
    dark: '#23242a',
  },
  'card-3': {
    light: '#f0ebe3',          // warm sand (was #f0f0f0)
    dark: '#2c2d34',
  },

  // ---------- Text colors ----------
  ink: {
    light: '#1a1a1d',
    dark: '#f5f5f8',
  },
  'ink-muted': {
    light: '#6b6b73',
    dark: '#a4a4ac',
  },
  'ink-soft': {
    light: '#a5a5ad',
    dark: '#6c6d76',
  },

  // ---------- Borders / dividers ----------
  line: {
    light: '#ece8e0',          // warmer hairline (was #eaeaea)
    dark: '#2c2d34',
  },
  'line-2': {
    light: '#f2efe9',
    dark: '#25262c',
  },

  // ---------- Legacy aliases (kept for backward compatibility) ----------
  primary: { light: '#f3d77a', dark: '#f3d77a' },
  secondary: { light: '#c95a3c', dark: '#dd7a5a' },
  accent: { light: '#4f772d', dark: '#6b9c3d' },
  surface: { light: '#f7f4ef', dark: '#131317' },
  'text-main': { light: '#1a1a1d', dark: '#f5f5f8' },
} as const;

// ============================================================
// ✏️ TYPOGRAPHY
// ============================================================
export const typography = {
  // Font families
  fontFamily: {
    // Body / UI
    sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
    // Editorial headings and display numerals
    serif: ['Fraunces', 'Georgia', 'serif'],
    // Tabular quantities (ingredient list)
    mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
    // Legacy alias — points at the serif so existing `font-display` usages
    // pick up the editorial look without code changes.
    display: ['Fraunces', 'Georgia', 'serif'],
  },

  /**
   * Mobile-first size scale.
   *
   * Each entry is [fontSize, lineHeight].
   * The site is mobile-first so default sizes target small screens; bump up
   * with `sm:`/`md:` modifiers where you want larger text on bigger screens.
   *
   * Sizes are slightly larger than Tailwind defaults to keep mobile reading
   * comfortable.
   */
  fontSize: {
    xs:   ['0.8125rem', { lineHeight: '1.25rem' }], // 13px  — pill labels, micro chips
    sm:   ['0.9375rem', { lineHeight: '1.5rem' }],  // 15px  — body small (was 14)
    base: ['1rem',      { lineHeight: '1.625rem' }],// 16px  — body
    lg:   ['1.125rem',  { lineHeight: '1.75rem' }], // 18px  — body large
    xl:   ['1.25rem',   { lineHeight: '1.875rem' }],// 20px  — section heading
    '2xl':['1.5rem',    { lineHeight: '2rem' }],    // 24px  — page heading
    '3xl':['1.875rem',  { lineHeight: '2.25rem' }], // 30px  — hero heading
    '4xl':['2.25rem',   { lineHeight: '2.5rem' }],  // 36px  — display
  },
} as const;

// ============================================================
// 📐 RADII
// ============================================================
export const radius = {
  none: '0',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  '2xl': '20px',  // card defaults
  '3xl': '24px',  // overlay / hero cards
  full: '9999px',
} as const;

// ============================================================
// 🌫 SHADOWS
// ============================================================
export const shadow = {
  card: '0 2px 8px rgba(0,0,0,.08)',
  overlay: '0 20px 50px -20px rgba(0,0,0,.2)',
  'overlay-dark': '0 20px 50px -20px rgba(0,0,0,.6)',
} as const;

// ============================================================
// 📏 LAYOUT
// ============================================================
export const layout = {
  // Side padding for main page content — mobile-first.
  // Mobile gets tighter padding so cards/lists feel full-width.
  pagePaddingX: {
    mobile: '0.75rem',  // 12px
    desktop: '1.25rem', // 20px
  },
  // Width of the side-menu drawer (relative units)
  sideMenuWidth: {
    mobile: '80%',
    tablet: '60%',
    desktop: '45%',
    wide: '33%',
  },
} as const;
