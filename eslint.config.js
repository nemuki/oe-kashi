import react from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'
import eslint from '@eslint/js'

export default [
  { ignores: ['dist', 'node_modules'] },
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { react },
    rules: {
      ...prettier.rules,
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
    },
  },
]
