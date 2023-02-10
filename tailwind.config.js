/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)'],
        chakra: ['var(--font-chakra)']
      }
    }
  },
  variants: {},
  plugins: ['@tailwindcss/forms']
}
