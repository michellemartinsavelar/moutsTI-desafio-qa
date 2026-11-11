import { defineConfig } from 'cypress'
import registrarRelatorio from 'cypress-mochawesome-reporter/plugin.js'
import { limparMassa } from './cypress/tarefas/limparMassa.js'
import { avisarTestesInstaveis } from './cypress/tarefas/avisarTestesInstaveis.js'

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Relatório de testes - ServeRest',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  e2e: {
    baseUrl: process.env.BASE_URL ?? 'https://front.serverest.dev',
    expose: {
      apiUrl: process.env.API_URL ?? 'https://serverest.dev',
    },
    setupNodeEvents(on) {
      registrarRelatorio(on)

      on('task', { limparMassa })
      on('after:spec', avisarTestesInstaveis)
    },
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 8000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
})
