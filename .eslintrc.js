module.exports = {
  env: {
    node: true,
    browser: true,
    es2022: true,
  },

  extends: "eslint:recommended",
  
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-constructor-return": ["error", "always"],
    "no-duplicate-imports": "error",
    "no-unmodified-loop-condition": "error",
    "no-unreachable-loop": "error",
    "no-unused-private-class-members": "error",
  },

  parserOptions: {
    ecmaVersion: "latest",
  },
};
