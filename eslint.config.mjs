// @ts-check
import eslintPluginAstro from 'eslint-plugin-astro';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  // Парсер и базовая конфигурация для .astro файлов
  ...eslintPluginAstro.configs['flat/base'],
  // Парсер TypeScript для .ts файлов
  {
    files: ['**/*.ts'],
    ...tseslint.configs.recommended[0],
  },
  // Сортировка импортов: external → internal/relative → стили (CSS внизу)
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts', '**/*.astro'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:', '^@?\\w'],
            ['^\\.(?!(.*\\.(css|scss|sass|less)$))', '^(?!.*\\.(css|scss|sass|less)$)'],
            ['.*\\.(css|scss|sass|less)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];
