module.exports = {
  extends: [
    "eslint:all",
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  plugins: ["prettier"],
  rules: {
    eqeqeq: ["error", "always"], // adding some custom ESLint rules
    "one-var": ["error", "never"],
    "no-ternary": "off",
    "sort-keys": "off",
    "id-length": "off",
    "no-plusplus": "off",
    camelcase: ["error", { properties: "never" }],
    "prefer-destructuring": ["error", { object: true, array: false }],
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
  },
  env: {
    node: true,
  },
};
