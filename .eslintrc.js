module.exports = {
  ...require("@relynk/eslint-config/eslint-node"),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.lint.json"],
  },
  rules: {
    ...require("@relynk/eslint-config/eslint-node").rules,
    "no-underscore-dangle": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "no-param-reassign": "off",
    eqeqeq: "off",
    "@typescript-eslint/naming-convention": "off",
    "default-case": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-shadow": "off",
    "no-prototype-builtins": "off",
  },
}
