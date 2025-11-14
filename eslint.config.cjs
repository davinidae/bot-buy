const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  // Global ignores (applies before file matching)
  {
    ignores: ["node_modules/**", "dist/**", "scripts/**"],
  },
  {
    files: ["**/*.ts", "**/*.spec.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json", // Connects ESLint to your tsconfig.json
        tsconfigRootDir: __dirname,
      },
      globals: {
        // Custom globals
        message: "writable",
        incoming_flow_id: "readonly",
        incoming_flow_no: "readonly",
        sequence: "readonly",
        master_message_no: "readonly",
        master_message_sequence: "readonly",
        master_message_number: "readonly",
        env: "readonly",
        issuing_date: "readonly",
        // Node.js globals
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        // Jest globals
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        jest: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules, // Include TypeScript recommended rules
      "prettier/prettier": "warn", // Warn about Prettier issues
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
