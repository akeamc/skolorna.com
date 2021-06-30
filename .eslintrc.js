module.exports = {
  extends: ["airbnb-typescript", "prettier"],
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "@typescript-eslint/quotes": ["error", "double"],
    "react/prop-types": "off",
    "import/prefer-default-export": "off",
  },
};
