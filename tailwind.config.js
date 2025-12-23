/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wepink': {
          'pink': '#FF0080',
          'dark-pink': '#CC0066',
          'light-pink': '#FF4DA6',
        },
        pink: {
          50: '#FFF0F8',
          100: '#FFE0F1',
          200: '#FFC2E3',
          300: '#FF99D1',
          400: '#FF4DA6',
          500: '#FF1A8C',
          600: '#FF0080',
          700: '#E60073',
          800: '#CC0066',
          900: '#B30059',
        },
      },
    },
  },
  plugins: [],
}

