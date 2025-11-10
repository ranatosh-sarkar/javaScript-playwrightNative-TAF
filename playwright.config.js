// playwright.config.js
const { defineConfig } = require('@playwright/test');
const Config = require('./src/utils/configManager');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Global defaults
  use: {
    baseURL: Config.get('baseURL'),
    headless: false,
    // IMPORTANT: Let the real browser window size apply
    viewport: null,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  // Per-project overrides
  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: ['--start-maximized']     // true maximize in headful Chromium
        }
      }
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1920, height: 1080 }
      }
    },
    // Uncomment if you run WebKit and want a big viewport there too
    // {
    //   name: 'WebKit',
    //   use: {
    //     browserName: 'webkit',
    //     viewport: { width: 1920, height: 1080 }
    //   }
    // }
  ],

  reporter: [
  ['list', { printSteps: true }],
  ['html', { outputFolder: 'reports/html-report', open: 'never' }],
  ['allure-playwright', { outputFolder: 'allure-results' }],
  ['junit', { outputFile: 'test-results/results.xml' }]
  ]
});
