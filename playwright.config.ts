import { defineConfig } from '@playwright/test'
import { config } from 'dotenv'

config()

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* All requests we send go to this API endpoint. */
    baseURL: process.env.MONO_STAGE,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    extraHTTPHeaders: {
      Accept: 'application/graphql-response+json',
      'Content-type': 'application/json',
    },
  },

  /* Configure projects to organize tests */
  projects: [
    {
      name: 'payment',
      testMatch: /.oneTimePayment.spec.ts/,
    },
  ],
})
