/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f3f0',
          100: '#ede3dc',
          200: '#dcc7b8',
          300: '#c6a587',
          400: '#b08660',
          500: '#a1714a',
          600: '#8d5d3e',
          700: '#744c36',
          800: '#5f3f32',
          900: '#4f352c',
        },
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
