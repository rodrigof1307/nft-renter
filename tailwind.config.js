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
        sm: ["1vw", { lineHeight: "1vw" }],
        md: ["1.1vw", { lineHeight: "1.1vw" }],
        lg: ["1.25vw", { lineHeight: "1.25vw" }],
        xl: ["1.4vw", { lineHeight: "1.4vw" }],
        "2xl": ["1.7vw", { lineHeight: "1.7vw" }],
        "3xl": ["2.1vw", { lineHeight: "2.1vw" }],
        "4xl": ["2.5vw", { lineHeight: "2.5vw" }],
        "5xl": ["3vw", { lineHeight: "3vw" }],
      },
    },
  },
  plugins: [],
};
