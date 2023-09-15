module.exports = {
  env: {
    node: true,
    browser: true,
    es2022: true,
  },

  parserOptions: {
    ecmaVersion: "latest",
  },

  extends: "eslint:recommended",

  rules: {
    indent: ["error", 2, { "SwitchCase": 1 }],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-constructor-return": ["error", "always"],
    "no-duplicate-imports": "error",
    "no-unmodified-loop-condition": "error",
    "no-unreachable-loop": "error",
    "no-unused-private-class-members": "error",
    "complexity": ["error", 3],
    "max-depth": ["error", 2],
  },

  "overrides": [
    {
      "files": ["public/scripts/*"],
      "rules": {
        "no-undef": "off",
        "no-unused-vars": "off",
      },
    },
  ],
};
