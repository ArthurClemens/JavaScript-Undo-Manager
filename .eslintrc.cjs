const OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  env: {
    browser: false,
    es6: true,
  },
  extends: ['prettier', 'plugin:jsx-a11y/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      modules: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    'import',
    'jsx-a11y',
  ],
  rules: {
    'prettier/prettier': ERROR,
    // ESLint rules
    'no-useless-computed-key': ERROR,
    'no-underscore-dangle': OFF,
    'arrow-parens': [ERROR, 'as-needed'],
    'no-nested-ternary': OFF,
    'import/prefer-default-export': OFF,
    'eol-last': [ERROR, 'always'],
    'import/extensions': [ERROR, { json: 'always' }],
    'import/no-unresolved': ERROR,
    'no-console': ['warn', { allow: ['error', 'info'] }],
  },
};
