import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#fecc06',
          dark: '#f9c701',
        },
        secondary: {
          light: '#7af8ff',
          dark: '#007e85',
        },
        accent: {
          light: '#3460fe',
          dark: '#012dcb',
        },
        surface: {
          light: '#fffefa',
          dark: '#050400',
        },
        'text-main': {
          light: '#1f1700',
          dark: '#fff7e0',
        },
      },
      borderRadius: {
        '2xl': '16px',
      },
    },
  },
  plugins: [],
} satisfies Config
