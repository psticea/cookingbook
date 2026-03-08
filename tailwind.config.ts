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
          light: '#4ac994',
          dark: '#36b580',
        },
        secondary: {
          light: '#e198ac',
          dark: '#671e31',
        },
        accent: {
          light: '#d1c366',
          dark: '#998b2e',
        },
        surface: {
          light: '#f4fbf9',
          dark: '#040b09',
        },
        'text-main': {
          light: '#071811',
          dark: '#e7f8f1',
        },
      },
      borderRadius: {
        '2xl': '16px',
      },
    },
  },
  plugins: [],
} satisfies Config
