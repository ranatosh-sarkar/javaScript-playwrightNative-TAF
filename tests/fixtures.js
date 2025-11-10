const { test: base, expect } = require('@playwright/test');
const ExcelRead = require('../src/utils/excelRead');
const Logger = require('../src/utils/logger');
const Config = require('../src/utils/configManager');

// ---- Load Excel ----
let homeRows = [];
let sanityRows = [];
try {
  homeRows   = ExcelRead.readExcel('testData/testData.xlsx', 'HomePage');
  sanityRows = ExcelRead.readExcel('testData/testData.xlsx', 'Sanity');
} catch (e) {
  Logger.error(`[fixtures] Excel load failed: ${e.message}`);
}

// ---- Extend with per-test data objects (row 0) ----
const test = base.extend({
  homeData:   [ homeRows[0] || {}, { scope: 'test' } ],
  sanityData: [ sanityRows[0] || {}, { scope: 'test' } ],
});

// ---- Navigate before each test ----
test.beforeEach(async ({ page }, testInfo) => {
  const projectBaseURL = testInfo.project?.use?.baseURL;
  const cfgBaseURL = Config.get('baseURL');
  const resolvedBaseURL = projectBaseURL ?? cfgBaseURL ?? '(no baseURL configured)';
  Logger.info(`URL launched: ${resolvedBaseURL}`);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

// ---- Optional run-level logs (safe) ----
test.beforeAll(async () => Logger.info('=== Test run started ==='));
test.afterAll(async ()  => Logger.info('=== Test run finished ==='));

test.afterEach(async ({}, ti) => {
  const file = ti.location?.file ?? ti.file ?? '';
  const line = ti.location?.line ?? ti.line ?? '';
  const loc  = file ? `${file}${line ? ':' + line : ''}` : '';
  const msg  = [
    'RESULT', String(ti.status).toUpperCase().padEnd(10),
    `proj=${ti.project?.name || 'n/a'}`, `worker=${ti.workerIndex}`,
    `time=${ti.duration}ms`, loc && `@ ${loc}`, `| ${ti.title}`
  ].filter(Boolean).join(' | ');
  if (ti.status === 'passed') Logger.info(`✅ ${msg}`);
  else if (ti.status === 'skipped') Logger.info(`⏭️  ${msg}`);
  else { Logger.error(`❌ ${msg}`); if (ti.error) Logger.error(ti.error.stack || ti.error.message); }
});

module.exports = { test, expect, homeRows, sanityRows };
