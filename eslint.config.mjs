import simpleImportSort from "eslint-plugin-simple-import-sort";
import typescriptEslint from "typescript-eslint";

export default [
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      curly: "error",
      eqeqeq: "error",
      "no-console": "warn",
      semi: "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports"
        },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
      ],
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_"
        },
      ],
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["src/test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-loop-func": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/require-await": "off",
    },
  },
];
