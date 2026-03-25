/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'civic-bg': '#FAFAF8',   // Warm Cream / Off-White
        'civic-paper': '#FFFFFF', // Pure White Surface
        'civic-muted': '#E8E6E1', // Warm Stone Gray
        'civic-dark': '#212121',  // WasteHeroes Dark Charcoal

        // Global Anti-Bluish Gray Override (True Dark) - Adjusted for distinguishability
        gray: {
          50: '#F9F9F9',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#333333', // Visible Borders
          800: '#1c1c1c', // Lower Surface / Cards
          900: '#121212', // Main Component Surface
          950: '#0a0a0a', // Deepest Background
        },

        // Primary Brand Colors (WasteHeroes)
        'civic-green': {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#2ECC71', // Vibrant WasteHeroes Green
          600: '#27AE60', // Darker Green
          700: '#1E8449',
        },
        'civic-orange': {
          50: '#FFF3E0',
          100: '#FFE0B2',
          500: '#F39C12', // WasteHeroes "Order Now" Orange
          600: '#D35400', // Darker Orange
        },
        'civic-yellow': {
          DEFAULT: '#F1C40F', // WasteHeroes Recycle Yellow
        },
        // Demoted Blue (Water/Info only)
        'civic-blue': {
          500: '#3498DB',
          600: '#2980B9',
          700: '#0369a1',
        },
        'civic-red': {
          DEFAULT: '#E74C3C', // Alert Red
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
