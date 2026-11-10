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
      // Nenhuma espera fixa: sincronização via asserções e intercepts
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-force': 'error',
      'cypress/no-pause': 'error',
      'cypress/no-debug': 'error',
      'cypress/no-assigning-return-values': 'error',
      'cypress/unsafe-to-chain-command': 'error',
      // Impede que it.only / it.skip cheguem ao repositório
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-pending-tests': 'error',
      // Compatibilidade com o estilo do Cypress
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-async-in-sync-tests': 'off',
      'mocha/max-top-level-suites': 'off',
    },
  },

  {
    files: ['cypress/e2e/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/massa/gerenciadorDeMassa'],
              message:
                'Nos specs, use cy.registrarUsuarioParaLimpeza / cy.registrarProdutoParaLimpeza.',
            },
          ],
        },
      ],
    },
  },

  prettier,
])
