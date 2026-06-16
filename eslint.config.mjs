import simpleImportSort from "eslint-plugin-simple-import-sort";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/class-methods-use-this": "error",
      "@typescript-eslint/consistent-type-exports": [
        "error",
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
        },
      ],
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/method-signature-style": ["error", "property"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: ["variable", "parameter"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          modifiers: ["const", "global"],
          format: ["camelCase", "UPPER_CASE"],
        },
        {
          selector: [
            "enumMember",
            "objectLiteralMethod",
            "objectLiteralProperty",
            "typeMethod",
            "typeProperty",
          ],
          modifiers: ["requiresQuotes"],
          format: null,
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unused-private-class-members": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/parameter-properties": "error",
      "@typescript-eslint/prefer-enum-initializers": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/require-array-sort-compare": [
        "error",
        {
          ignoreStringArrays: true,
        },
      ],
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowAny: false,
          allowNullableBoolean: false,
          allowNullableEnum: false,
          allowNullableNumber: false,
          allowNullableObject: false,
          allowNullableString: false,
          allowNumber: false,
          allowString: false,
        },
      ],
      "@typescript-eslint/strict-void-return": [
        "error",
        {
          allowReturnAny: false,
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          considerDefaultExhaustiveForUnions: false,
          requireDefaultForNonUnion: true,
        },
      ],
      "accessor-pairs": "error",
      "array-callback-return": [
        "error",
        {
          checkForEach: true,
        },
      ],
      curly: "error",
      "default-case-last": "error",
      eqeqeq: [
        "error",
        "always",
        {
          null: "ignore",
        },
      ],
      "grouped-accessor-pairs": "error",
      "guard-for-in": "error",
      "new-cap": [
        "error",
        {
          newIsCap: true,
          capIsNew: false,
          properties: true,
        },
      ],
      "no-alert": "error",
      "no-await-in-loop": "error",
      "no-caller": "error",
      "no-cond-assign": ["error", "always"],
      "no-console": "warn",
      "no-constructor-return": "error",
      "no-duplicate-imports": [
        "error",
        {
          allowSeparateTypeImports: true,
        },
      ],
      "no-else-return": [
        "error",
        {
          allowElseIf: false,
        },
      ],
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-implicit-coercion": "error",
      "no-iterator": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-mixed-operators": [
        "error",
        {
          groups: [
            ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
            ["&&", "||"],
            ["in", "instanceof"],
          ],
          allowSamePrecedence: true,
        },
      ],
      "no-multi-assign": "error",
      "no-multi-str": "error",
      "no-nested-ternary": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-octal-escape": "error",
      "no-promise-executor-return": "error",
      "no-proto": "error",
      "no-restricted-exports": [
        "error",
        {
          restrictedNamedExports: ["then"],
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "isFinite",
          message: "Use Number.isFinite instead",
        },
        {
          name: "isNaN",
          message: "Use Number.isNaN instead",
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "arguments",
          property: "callee",
          message: "arguments.callee is deprecated",
        },
        {
          object: "global",
          property: "isFinite",
          message: "Use Number.isFinite instead",
        },
        {
          object: "self",
          property: "isFinite",
          message: "Use Number.isFinite instead",
        },
        {
          object: "window",
          property: "isFinite",
          message: "Use Number.isFinite instead",
        },
        {
          object: "global",
          property: "isNaN",
          message: "Use Number.isNaN instead",
        },
        {
          object: "self",
          property: "isNaN",
          message: "Use Number.isNaN instead",
        },
        {
          object: "window",
          property: "isNaN",
          message: "Use Number.isNaN instead",
        },
        {
          property: "__defineGetter__",
          message: "Use Object.defineProperty instead",
        },
        {
          property: "__defineSetter__",
          message: "Use Object.defineProperty instead",
        },
        {
          object: "Math",
          property: "pow",
          message: "Use the ** operator instead",
        },
      ],
      "no-return-assign": ["error", "always"],
      "no-script-url": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-shadow": "off",
      "no-template-curly-in-string": "error",
      "no-unassigned-vars": "error",
      "no-undef-init": "error",
      "no-unmodified-loop-condition": "error",
      "no-unneeded-ternary": [
        "error",
        {
          defaultAssignment: false,
        },
      ],
      "no-unsafe-optional-chaining": [
        "error",
        {
          disallowArithmeticOperators: true,
        },
      ],
      "no-useless-assignment": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "no-with": "error",
      "object-shorthand": ["error", "always"],
      "one-var": [
        "error",
        {
          initialized: "never",
        },
      ],
      "operator-assignment": ["error", "always"],
      "prefer-arrow-callback": "error",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
        },
      ],
      "prefer-exponentiation-operator": "error",
      "prefer-numeric-literals": "error",
      "prefer-object-has-own": "error",
      "prefer-object-spread": "error",
      "prefer-promise-reject-errors": [
        "error",
        {
          allowEmptyReject: true,
        },
      ],
      "prefer-regex-literals": [
        "error",
        {
          disallowRedundantWrapping: true,
        },
      ],
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      radix: "error",
      semi: "error",
      "symbol-description": "error",
      "use-isnan": [
        "error",
        {
          enforceForSwitchCase: true,
          enforceForIndexOf: true,
        },
      ],
      "valid-typeof": [
        "error",
        {
          requireStringLiterals: true,
        },
      ],
      yoda: [
        "error",
        "never",
        {
          exceptRange: true,
        },
      ],
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
);
