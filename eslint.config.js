// @ts-check
const eslint = require('@eslint/js')
const { defineConfig } = require('eslint/config')
const tseslint = require('typescript-eslint')
const angular = require('angular-eslint')

module.exports = defineConfig([
    {
        files: ['**/*.ts'],
        extends: [eslint.configs.recommended, tseslint.configs.strict, tseslint.configs.stylistic, angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        rules: {
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'perpetuum', style: 'camelCase' }],
        },
    },
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    },
])
