import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ===== Card Stack design tokens =====
        brand: {
          yellow: '#f5cb5c',
          accent: '#4f772d',
          'accent-bright': '#6b9c3d',
          warm: '#e07a5f',
          pink: '#e198ac',
        },
        // Layered surfaces
        bg: {
          light: '#f8f6f3',
          dark: '#1c1d24',
        },
        card: {
          light: '#ffffff',
          dark: '#272832',
        },
        'card-2': {
          light: '#fafafa',
          dark: '#31323e',
        },
        'card-3': {
          light: '#f0f0f0',
          dark: '#3b3d4a',
        },
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
        line: {
          light: '#eaeaea',
          dark: '#3a3c47',
        },
        'line-2': {
          light: '#f0f0f0',
          dark: '#2f3039',
        },

        // ===== Legacy tokens (kept for backward compat, mapped to new palette) =====
        primary: {
          light: '#f5cb5c',
          dark: '#f5cb5c',
        },
        secondary: {
          light: '#e07a5f',
          dark: '#e07a5f',
        },
        accent: {
          light: '#4f772d',
          dark: '#6b9c3d',
        },
        surface: {
          light: '#f8f6f3',
          dark: '#1c1d24',
        },
        'text-main': {
          light: '#111111',
          dark: '#f2f3f7',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,.08)',
        overlay: '0 20px 50px -20px rgba(0,0,0,.2)',
        'overlay-dark': '0 20px 50px -20px rgba(0,0,0,.6)',
      },
    },
  },
  plugins: [],
} satisfies Config
