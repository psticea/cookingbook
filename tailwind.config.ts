import type { Config } from 'tailwindcss'
import { colors, typography, radius, shadow } from './src/design/tokens'

/**
 * Tailwind config — pulls every design value from src/design/tokens.ts so
 * there's a single source of truth for the visual system.
 *
 * To re-skin the website, edit src/design/tokens.ts only.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      colors,
      borderRadius: radius,
      boxShadow: shadow,
    },
  },
  plugins: [],
} satisfies Config
