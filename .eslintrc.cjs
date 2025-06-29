// ESLint config compatible with ESLint 8 and Node.js 16
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier' // This should come last
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-refresh',
    'prettier'
  ],
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',
    
    // Core rules - disabled in favor of TypeScript equivalents
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_|^React$',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-return': 'error',
    
    // React Refresh
    'react-refresh/only-export-components': 'warn',
    
    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: [
    'dist',
    'build',
    'node_modules',
    '*.min.js',
    'public/**/*',
    'vite.config.ts'
  ],
};
