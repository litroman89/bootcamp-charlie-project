/** @type {import("prettier").Config} */
export default {
    semi: true,
    singleQuote: true,
    jsxSingleQuote: true,
    bracketSpacing: true,
    trailingComma: 'all',
    tabWidth: 4,
    arrowParens: 'avoid',
    endOfLine: 'lf',
    plugins: ['prettier-plugin-astro'],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
};