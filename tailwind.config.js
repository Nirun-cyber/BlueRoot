/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-green': {
          DEFAULT: '#4caf50',
          light: '#81c784',
          dark: '#388e3c',
        },
        'agri-blue': {
          DEFAULT: '#0073e6',
          light: '#4dabf5',
          dark: '#0056b3',
        },
        'primary-blue': '#0073e6',
        'primary-green': '#4caf50',
        'agri-dark': '#0a0a0a',
        'agri-surface': '#1a1a1a',
      },
      animation: {
        'slow-pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
