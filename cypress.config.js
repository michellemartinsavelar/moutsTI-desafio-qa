import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL ?? 'https://front.serverest.dev',
    expose: {
      apiUrl: process.env.API_URL ?? 'https://serverest.dev',
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
