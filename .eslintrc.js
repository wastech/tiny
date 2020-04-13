module.exports = {
  extends: [
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  plugins: ["prettier"],
  rules: {
    eqeqeq: ["error", "always"], // adding some custom ESLint rules
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
  },
  env: {
    node: true,
  },
};
