// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-console": "warn",
    "no-debugger": 0,
    "no-undef": 0,
    "@typescript-eslint/no-var-requires": 0,
    "react/prop-types": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "no-useless-escape": 0,
    "react/react-in-jsx-scope": 0,
    "react/display-name": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-function": 0
  }
};