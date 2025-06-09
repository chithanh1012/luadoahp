module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  },
  ignorePatterns: ['**/*.min.js', '**/lib/*.js', 'node_modules'],
  globals: {
    jQuery: 'readonly',
    $: 'readonly',
  },
}
