module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "airbnb-typescript",
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "@typescript-eslint/quotes": ["error", "double"],
    "react/prop-types": "off",
    "import/prefer-default-export": "off",
    "jsx-a11y/anchor-is-valid": "off", // next/link
  },
};
