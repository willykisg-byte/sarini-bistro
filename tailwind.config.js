/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#17140f',
        stone: {
          DEFAULT: '#2b2620',
          light: '#3a332a',
        },
        gold: {
          DEFAULT: '#c9a24b',
          bright: '#dfc07a',
        },
        cream: '#f2ece0',
        olive: '#6b7a4f',
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
