// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:json/recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {

    //
    // Possible problems
    //
    'no-constructor-return': 'error',
    'no-unused-vars': [
      'error', {
        'varsIgnorePattern': '^_',
        'argsIgnorePattern': '^_',
      },
    ],
    'no-template-curly-in-string': 'error',
    'no-promise-executor-return': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { 'functions': true, 'classes': true, 'variables': false }],

    //
    // Suggestions
    //
    'curly': [
      'error',
      'multi-line',
      'consistent',
    ],
    'default-case': 'error',
    'default-case-last': 'error',
    'default-param-last': 'error',
    'dot-notation': 'error',
    'eqeqeq': 'error',
    'no-array-constructor': 'error',
    'no-confusing-arrow': 'error',
    // 'no-console': 'warn',  // TODO: Should be error. We need to implement an error processing unit as to not use console.logs
    'no-else-return': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': [
      'error', {
        'lexicalBindings': true,
      },
    ],
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-mixed-operators': 'error',
    'no-nested-ternary': 'error',
    'no-new': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-plusplus': 'error',
    'no-proto': 'error',
    'no-return-assign': 'error',
    'no-shadow': 'error',
    'no-throw-literal': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-constructor': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-warning-comments': 'warn',
    'operator-assignment': [
      'error',
      'always',
    ],
    'prefer-arrow-callback': 'error',
    'prefer-const': [
      'error', {
        'destructuring': 'all',
      },
    ],
    'prefer-exponentiation-operator': 'error',
    'prefer-object-spread': 'error',
    'prefer-regex-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'radix': 'error',
    'require-await': 'error',
    'spaced-comment': [
      'error',
      'always',
    ],

    //
    // Layout & Formatting
    //
    'array-bracket-newline': [
      'error',
      'consistent',
    ],
    'array-bracket-spacing': [
      'error',
      'never',
    ],
    'arrow-parens': [
      'error',
      'always',
    ],
    'arrow-spacing': [
      'error', {
        'before': true,
        'after': true,
      },
    ],
    'block-spacing': [
      'error',
      'always',
    ],
    'brace-style': [
      'error',
      '1tbs', {
        'allowSingleLine': true,
      },
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'comma-spacing': 'error',
    'comma-style': [
      'error',
      'last',
    ],
    'computed-property-spacing': 'error',
    'dot-location': [
      'error',
      'property',
    ],
    'eol-last': 'error',
    'func-call-spacing': 'error',
    'function-call-argument-newline': [
      'error',
      'consistent',
    ],
    'function-paren-newline': [
      'error',
      'multiline',
    ],
    'implicit-arrow-linebreak': [
      'error',
      'beside',
    ],
    'indent': [
      'error',
      2,
    ],
    'jsx-quotes': [
      'error',
      'prefer-double',
    ],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'linebreak-style': [
      'error',
      'unix',
    ],
    'lines-between-class-members': [
      'error',
      'always', {
        'exceptAfterSingleLine': true,
      },
    ],
    'max-len': [
      'error', {
        'code': 120,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreComments': true,
      },
    ],
    'new-parens': 'error',
    'newline-per-chained-call': [
      'error', {
        'ignoreChainWithDepth': 2,
      },
    ],
    'no-extra-parens': [
      'error',
      'functions',
    ],
    'no-multi-spaces': [
      'error', {
        'ignoreEOLComments': true,
      },
    ],
    'no-multiple-empty-lines': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-newline': [
      'error', {
        'consistent': true,
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'operator-linebreak': [
      'error',
      'before',
    ],
    'padded-blocks': ['error', 'never'],
    'padding-line-between-statements': 'error',
    'quotes': [
      'error',
      'single',
    ],
    'rest-spread-spacing': 'error',
    'semi': ['error', 'never'],
    'semi-spacing': 'error',
    'semi-style': ['error', 'last'],
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error', {
        'asyncArrow': 'always',
        'named': 'never',
        'anonymous': 'never',
      },
    ],
    'space-in-parens': [
      'error',
      'never',
    ],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'switch-colon-spacing': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
    'wrap-regex': 'error',
  },
}
