import { fixupConfigRules } from "@eslint/compat";
// import reactRefresh from "eslint-plugin-react-refresh"; // Not installed
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/dist", "**/.eslintrc.cjs"],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
    ),
  ),
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react-refresh/only-export-components": "off",
      "react/jsx-uses-react": "error",
      "react/react-in-jsx-scope": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclaration[kind='let']",
          message: "let is not allowed, use const instead",
        },
      ],
    },
  },
];
