import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import { config, configs } from 'typescript-eslint';

export default config(
  { ignores: ['dist', 'dist-lib'] },
  {
    extends: [js.configs.recommended, ...configs.recommended],
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ignores: ['eslint.config.mjs', '**/exports-unused.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      sourceType: 'module',
    },
    plugins: {},
    rules: {},
  },
  perfectionist.configs['recommended-natural'],
  eslintConfigPrettier,
);
