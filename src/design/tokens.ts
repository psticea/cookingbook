/**
 * Design tokens — "The Light Table". Single source of truth for Tailwind.
 * Human-readable rules live in DESIGN.md at the repo root; keep both in sync.
 *
 * Colours are CSS custom properties holding RGB channels, defined per theme in
 * src/index.css (`:root` = Gallery Wall, `.dark` = Darkroom). Components use the
 * semantic names below and never need `dark:` colour overrides.
 */

const channel = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export const colors = {
  wall: channel('wall'),               // page background
  paper: channel('paper'),             // raised sheets: side menu, notes, receipts
  ink: {
    DEFAULT: channel('ink'),           // primary text, selected controls, focus
    2: channel('ink-2'),               // Pencil: secondary text, metadata
    3: channel('ink-3'),               // Soft Pencil: units, counts, placeholders
  },
  line: {
    DEFAULT: channel('line'),          // Hairline: dividers and rules
    strong: channel('line-strong'),    // Silver: control outlines
  },
  frame: channel('frame'),             // empty print mount while a photo loads
  mark: channel('mark'),               // China Marker: active choice only
  'on-mark': channel('on-mark'),
} as const;

export const typography = {
  fontFamily: {
    sans: ['Archivo', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  },
  // Mobile-first scale: [size, line-height]. The large-text preference scales the root to 112.5%.
  fontSize: {
    xs: ['0.8125rem', { lineHeight: '1.3' }],   // 13px — badges, short labels (floor)
    sm: ['0.875rem', { lineHeight: '1.4' }],    // 14px — meta: minutes, lei, counts
    ui: ['0.9375rem', { lineHeight: '1.4' }],   // 15px — buttons, chips, controls
    base: ['1rem', { lineHeight: '1.5' }],      // 16px — body, print titles
    md: ['1.0625rem', { lineHeight: '1.3' }],   // 17px — section labels, wordmark
    lg: ['1.25rem', { lineHeight: '1.2' }],     // 20px — titles
    xl: ['1.375rem', { lineHeight: '1.2' }],    // 22px — featured title (desktop), empty state
    '2xl': ['1.5rem', { lineHeight: '1.1' }],   // 24px — headline (mobile)
    '3xl': ['1.875rem', { lineHeight: '1.1' }], // 30px — headline (tablet)
    '4xl': ['2.125rem', { lineHeight: '1.1' }], // 34px — headline (desktop)
  },
} as const;

export const radius = {
  none: '0',
  print: '2px',
  ctl: '3px',
  full: '9999px',
} as const;

export const shadow = {
  sheet: 'var(--sheet-shadow)',
} as const;

export const motion = {
  ease: 'cubic-bezier(.16, 1, .3, 1)',
  'ease-in-out': 'cubic-bezier(.65, 0, .35, 1)',
} as const;

export const layout = {
  maxWidth: '1400px',
  gutter: { narrow: '14px', mobile: '16px', tablet: '32px', desktop: '48px' },
  barHeight: { mobile: '56px', tablet: '64px' },
  target: '44px',
} as const;
