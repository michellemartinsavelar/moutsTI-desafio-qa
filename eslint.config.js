import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import pluginCypress from 'eslint-plugin-cypress'
import pluginMocha from 'eslint-plugin-mocha'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['node_modules/', 'cypress/reports/', 'cypress/screenshots/', 'cypress/videos/']),

  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      eqeqeq: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'error',
      'object-shorthand': 'error',
    },
  },

  {
    files: ['cypress/**/*.js'],
    extends: [pluginCypress.configs.recommended, pluginMocha.configs.recommended],
    rules: {
      // sem espera fixa, force, pause ou debug nos testes
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-force': 'error',
      'cypress/no-pause': 'error',
      'cypress/no-debug': 'error',
      'cypress/no-assigning-return-values': 'error',
      'cypress/unsafe-to-chain-command': 'error',
      // it.only e it.skip não podem chegar ao repositório
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-pending-tests': 'error',
      // regras do mocha que não combinam com o jeito do Cypress
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-async-in-sync-tests': 'off',
      'mocha/max-top-level-suites': 'off',
    },
  },

  prettier,
])
