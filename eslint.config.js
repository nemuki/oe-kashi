import react from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'
import eslint from '@eslint/js'

export default [
    eslint.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: { react },
        rules: {
            indent: ['error', 4],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single'],
            semi: ['error', 'never'],
        },
    },
    prettier,
]
