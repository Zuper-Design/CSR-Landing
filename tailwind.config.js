/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#fd5000',
          cream: '#f8f5f0',
          'cream-light': '#f8f5f1',
          'dark-red': '#b5271c',
          dark: '#191919',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'geist-mono': ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
