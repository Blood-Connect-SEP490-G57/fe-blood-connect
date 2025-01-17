/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    //default rules from installed plugins
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    //disable conflict rules between eslint and prettier
    'eslint-config-prettier',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    //turn off 'import React' rules in jsx files
    'react/react-in-jsx-scope': 'off',
    //warning blank target anchor tag without no-referrer rel
    'react/jsx-no-target-blank': 'warn',
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    //prettier rules
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ]
  },
  settings: {
    react: {
      //tell eslint-plugin-react to automatically detect React version
      version: 'detect'
    },
    //tell ESLint how to solve imports
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, '')],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json')
      }
    }
  }
}
