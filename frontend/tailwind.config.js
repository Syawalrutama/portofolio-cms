/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Dark Theme Palette (Indigo/Slate tones)
        primary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dbe7',
          300: '#a6bdd3',
          400: '#7599bc',
          500: '#527ba3',
          600: '#3e6187',
          700: '#334e6e',
          800: '#2c435c',
          900: '#28394e',
          955: '#111827', // Darker background slate
        }
      }
    },
  },
  plugins: [],
}
