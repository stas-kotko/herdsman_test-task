import stylistic from '@stylistic/eslint-plugin'

export default [{
	env: {
		browser: true,
		es2021: true
	},
	ignores: [
		'node_modules',
		'dist'
	],
	languageOptions: {
		parserOptions: {
			ecmaVersion: "latest",
			sourceType: "module"
		},
	},
	// extends: "standard-with-typescript",
	plugins: {
		'@stylistic': stylistic
	},
	rules: {
		'@stylistic/indent': ['error', 2],
	},
}]