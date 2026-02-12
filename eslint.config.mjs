import { fixupConfigRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/dist', '**/.eslintrc.cjs', '**/build'],
	},
	js.configs.recommended,
	...fixupConfigRules(
		compat.extends(
			'plugin:@typescript-eslint/recommended',
			'plugin:react/recommended',
			'plugin:react/jsx-runtime',
			'plugin:react-hooks/recommended',
		),
	),
	{
		plugins: {
			unicorn: eslintPluginUnicorn,
		},
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			},
		},

		rules: {
			// Indentation - use tabs
			'indent': ['error', 'tab', { SwitchCase: 1 }],

			// No trailing commas
			'comma-dangle': ['error', 'never'],

			// Formatting rules
			'semi': ['error', 'always'],
			'quotes': ['error', 'single', { avoidEscape: true }],
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'comma-spacing': ['error', { before: false, after: true }],
			'key-spacing': ['error', { beforeColon: false, afterColon: true }],
			'space-before-blocks': ['error', 'always'],
			'space-infix-ops': 'error',
			'space-before-function-paren': ['error', {
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always'
			}],
			'arrow-spacing': ['error', { before: true, after: true }],
			'no-multi-spaces': 'error',
			'no-trailing-spaces': 'error',
			'eol-last': ['error', 'always'],

			// Code quality
			'no-console': 'warn',
			'no-debugger': 'error',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			}],
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',

			// React specific
			'react/jsx-uses-react': 'error',
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react/jsx-indent': ['error', 'tab'],
			'react/jsx-indent-props': ['error', 'tab'],

			// Custom rules
			'no-restricted-syntax': [
				'error',
				{
					selector: "VariableDeclaration[kind='let']",
					message: 'let is not allowed, use const instead',
				},
			],
			'linebreak-style': 'off',
			'no-continue': 'off',
		},
	},
];
