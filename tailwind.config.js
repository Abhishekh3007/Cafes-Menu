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
        // Modern-Warm & Chic Palette
        'warm-cream': '#FDFBF5',      // Main Background
        'light-taupe': '#D3BBAF',     // Secondary Backgrounds
        'vibrant-coral': '#E57F6A',   // Primary Buttons and Key Actions
        'soft-gold': '#D1B07C',       // Main Headings and Highlights
        'charcoal-brown': '#413F3D',  // Standard Body Text
        
        // Accent variations for better contrast
        'coral-light': '#F2A393',     // Lighter coral for accents
        'gold-light': '#E6C797',      // Lighter gold for accents
        
        // Additional supporting colors
        'cream-dark': '#F7F3E9',      // Darker cream for subtle sections
        'taupe-dark': '#C4A896',      // Darker taupe for borders
        'brown-light': '#8B8985',     // Lighter brown for secondary text
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
