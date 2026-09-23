import type { Config } from 'tailwindcss'
import { colors, typography, radius, shadow, motion, layout } from './src/design/tokens'

/**
 * Tailwind config — every design value comes from src/design/tokens.ts
 * (documented in DESIGN.md). Edit tokens there, not here.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // Full override (not extend) so breakpoints stay in ascending order.
    screens: { xs: '375px', sm: '600px', md: '768px', lg: '1100px', xl: '1440px' },
    extend: {
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      colors,
      borderRadius: radius,
      boxShadow: shadow,
      transitionTimingFunction: motion,
      maxWidth: { page: layout.maxWidth, prose: '720px' },
      minHeight: { target: layout.target },
      minWidth: { target: layout.target },
    },
  },
  plugins: [],
} satisfies Config
