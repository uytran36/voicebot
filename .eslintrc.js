module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-nested-ternary': 'off',
    'react/require-default-props': 'warn',
    '@typescript-eslint/camelcase': 'off',
    'no-underscore-dangle': 'off',
    'react/no-array-index-key': 'off',
    'react/prop-types': 'error',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
  },
};
