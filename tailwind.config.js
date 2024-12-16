/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#BE092B',
          hover: '#a30825',
          light: '#f5d7dc',
        }
      },
      fontFamily: {
        'agdasima': ['var(--font-agdasima)'],
        'inter': ['var(--font-inter)'],
        'arabic': ['var(--font-arabic)'],
      },
    },
  },
  plugins: [],
}