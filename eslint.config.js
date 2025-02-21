import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import eslintPluginReact from "eslint-plugin-react";

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  next.configs.recommended,
  {
    plugins: {
      react: eslintPluginReact, // ✅ Plugins must be an object, not an array
    },
    rules: {
      "react/no-unescaped-entities": "warn",
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
