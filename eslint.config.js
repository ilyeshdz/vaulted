import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import eslintJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { fixupPluginRules } from '@eslint/compat';

export default [
    eslintJs.configs.recommended,
    {
        files: ['src/**/*.ts'],
        plugins: {
            '@typescript-eslint': tseslint,
            prettier: fixupPluginRules(prettierPlugin),
        },
        languageOptions: {
            parser: tseslintParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            ...tseslint.configs['recommended'].rules,
            'prettier/prettier': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
        },
    },
    prettierConfig,
];
