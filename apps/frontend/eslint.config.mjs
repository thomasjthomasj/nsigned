import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    ignores: [
      "**/*.js",
      "**/*.mjs",
      "**/*.json",
      "node_modules/**",
      "public/**",
      "styles/**",
      ".next/**",
      "coverage/**",
      "dist/**",
      ".turbo/**",
      "tsconfig.tsbuildinfo",
      "**/*.test.tsx",
      "**/*.stories.tsx",
      ".storybook/**",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        JSX: "readonly",
        NodeJS: "readonly",
        Remirror: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      next: {
        rootDir: ["apps/*/", "packages/*/"],
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["apps/*/tsconfig.json", "packages/*/tsconfig.json"],
        },
      },
    },
    rules: {
      // Prettier
      "prettier/prettier": "error",

      // React
      "react/require-default-props": "off",
      "react/jsx-props-no-spreading": "off",
      "react/destructuring-assignment": "off",
      "react/react-in-jsx-scope": "off",
      "react/function-component-definition": "off",
      "react/display-name": "off",

      // Import
      "import/no-cycle": "off",
      "import/prefer-default-export": "off",
      "import/no-anonymous-default-export": "off",
      "import/no-named-as-default": "off",
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            orderImportKind: "asc",
            caseInsensitive: false,
          },
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
            {
              pattern: "@ja-packages/**",
              group: "internal",
              position: "before",
            },
          ],
          warnOnUnassignedImports: true,
          "newlines-between": "always",
          distinctGroup: true,
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroupsExcludedImportTypes: ["@ja-packages", "type"],
        },
      ],

      // TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // General
      "no-console": "error",
      "no-sequences": "off",
      "no-await-in-loop": "off",
      "no-continue": "off",
      "func-names": "off",
      "class-methods-use-this": "off",

      // Next.js
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
