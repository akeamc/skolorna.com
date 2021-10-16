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
    "react/jsx-props-no-spreading": "off",
    "import/prefer-default-export": "off",
    "jsx-a11y/anchor-is-valid": "off", // next/link
  },
  overrides: [
    {
      files: ["*.stories.tsx"],
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
