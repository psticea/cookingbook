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
    yellow: '#f5cb5c',         // servings strip highlight, accents
    accent: '#4f772d',         // primary action green (light theme)
    'accent-bright': '#6b9c3d', // primary action green (dark theme)
    warm: '#e07a5f',           // terracotta — notes, category pill on recipe
    pink: '#e198ac',           // secondary accent
  },

  // ---------- Page backgrounds (the canvas behind cards) ----------
  bg: {
    light: '#f8f6f3',
    dark: '#1c1d24',
  },

  // ---------- Card surfaces (3 stacked layers) ----------
  card: {
    light: '#ffffff',
    dark: '#272832',
  },
  'card-2': {
    // Inner rows inside a card (ingredient rows, sub-bg)
    light: '#fafafa',
    dark: '#31323e',
  },
  'card-3': {
    // Tab tracks, deepest inset surface
    light: '#f0f0f0',
    dark: '#3b3d4a',
  },

  // ---------- Text colors ----------
  ink: {
    light: '#111111',
    dark: '#f2f3f7',
  },
  'ink-muted': {
    light: '#666666',
    dark: '#b8bac4',
  },
  'ink-soft': {
    light: '#999999',
    dark: '#868892',
  },

  // ---------- Borders / dividers ----------
  line: {
    light: '#eaeaea',
    dark: '#3a3c47',
  },
  'line-2': {
    // Subtle hairlines inside cards
    light: '#f0f0f0',
    dark: '#2f3039',
  },

  // ---------- Legacy aliases (kept for backward compatibility) ----------
  primary: { light: '#f5cb5c', dark: '#f5cb5c' },
  secondary: { light: '#e07a5f', dark: '#e07a5f' },
  accent: { light: '#4f772d', dark: '#6b9c3d' },
  surface: { light: '#f8f6f3', dark: '#1c1d24' },
  'text-main': { light: '#111111', dark: '#f2f3f7' },
} as const;

// ============================================================
// ✏️ TYPOGRAPHY
// ============================================================
export const typography = {
  // Font families
  fontFamily: {
    sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
    display: ['Plus Jakarta Sans', 'Outfit', 'system-ui', 'sans-serif'],
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
