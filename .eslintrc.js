// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:json/recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        printWidth: 120,
      },
    ],
    "max-len": [
      "error",
      {
        code: 120,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
      },
    ],
  },
  env: {
    browser: true,
    node: true,
  },
};
