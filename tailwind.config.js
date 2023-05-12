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
        darkPurple: "#580A88",
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
        sm: ["1vw", { lineHeight: "1.2vw" }],
        md: ["1.1vw", { lineHeight: "1.3vw" }],
        lg: ["1.25vw", { lineHeight: "1.45vw" }],
        xl: ["1.4vw", { lineHeight: "1.6vw" }],
        "2xl": ["1.7vw", { lineHeight: "1.9vw" }],
        "3xl": ["2.1vw", { lineHeight: "2.3vw" }],
        "4xl": ["2.5vw", { lineHeight: "2.7vw" }],
        "5xl": ["3vw", { lineHeight: "3.2vw" }],
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
