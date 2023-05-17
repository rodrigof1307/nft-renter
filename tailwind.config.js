/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brightBlue: "#00BFFF",
        brightPink: "#C026D3",
        darkPurple: "#650b9c",
        darkRed: "#8B0000",
        backgroundPurple1: "#110929",
        backgroundPurple2: "#290049",
        backgroundPurple3: "#1D0E49",
        shadedBackgroundPurple1: "#180535",
        shadedBackgroundPurple2: "#1F0037",
        shadedBackgroundPurple3: "#19063E",
      },
      fontFamily: {
        highlight: ["var(--font-monumentExtended)"],
        sans: ["var(--font-lora)"],
      },
      fontSize: {
        xs: ["0.75vw", { lineHeight: "0.95vw" }],
        sm: ["0.95vw", { lineHeight: "1.15vw" }],
        md: ["1.1vw", { lineHeight: "1.3vw" }],
        lg: ["1.3vw", { lineHeight: "1.5vw" }],
        xl: ["1.5vw", { lineHeight: "1.7vw" }],
        "2xl": ["1.7vw", { lineHeight: "1.9vw" }],
        "3xl": ["2.1vw", { lineHeight: "2.3vw" }],
        "4xl": ["2.5vw", { lineHeight: "2.7vw" }],
        "5xl": ["3vw", { lineHeight: "3.2vw" }],
        "mb-xs": ["1.5vw", { lineHeight: "1.9vw" }],
        "mb-sm": ["1.9vw", { lineHeight: "2.3vw" }],
        "mb-md": ["2.2vw", { lineHeight: "2.6vw" }],
        "mb-lg": ["2.6vw", { lineHeight: "3vw" }],
        "mb-xl": ["3vw", { lineHeight: "3.4vw" }],
        "mb-2xl": ["3.4vw", { lineHeight: "3.8vw" }],
        "mb-3xl": ["4.2vw", { lineHeight: "4.6vw" }],
        "mb-4xl": ["5vw", { lineHeight: "5.4vw" }],
        "mb-5xl": ["6vw", { lineHeight: "6.4vw" }],
      },
      keyframes: {
        opacityAnim: {
          to: {
            opacity: 1,
          },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        slideDown: {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};
