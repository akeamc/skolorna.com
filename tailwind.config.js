const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        mono: ['"JetBrains Mono"', ...fontFamily.mono],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
