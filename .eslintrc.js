module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react'],
  rules: {
    'no-unused-vars': 'warn',
    'react/prop-types': 'warn',
    'no-dupe-class-members': 'warn',
    'react/no-unknown-property' : 'warn',
  },
}
