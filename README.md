Playwright Native Test Automation Framework (JS)

A lean, opinionated Playwright + JavaScript (TDD) framework that stays clean, fast, and CI-ready. It follows DRY/KISS/SOLID, uses simple ES6 Page Objects, and ships with truthful logs + reports.

⚙️ Tech Stack

Engine: Playwright core (no external WebDriver)

Build & Deps: npm + package.json

Runner: Playwright Test (test, test.beforeEach, projects/workers for parallel)

Style: TDD (can layer BDD later)

POM: ES6 classes in src/pages/ extending BasePage

Reporting: Playwright HTML (local) + Allure (via Jenkins plugin)

Logging: log4js (+ optional listeners/custom reporter)

Test Data: Excel/JSON via ExcelRead.js; specs consume via fixtures

Patterns:

Singleton: Config, Logger

Observer: listeners / custom reporter for events

Factory: not needed—Playwright selects browser via CLI/projects

🧩 The 5 Pillars of a SOLID TAF

Clean Architecture Layering
a) Build & Dependencies · b) Configuration · c) Core/Base · d) Tests & Page Objects · e) Utilities (fixtures, reporters, CI hooks)

Design Patterns that serve the framework
Singleton (config/logging), Observer (telemetry/reporting), POM (stable, intention-revealing interactions)

Logs & Reports that tell the truth
Real-time log4js + artifacts (traces, screenshots, videos)

Test Data done right
Excel/JSON → typed access in fixtures

Parallel & Scale by default
Projects/workers + stable sync (auto-waits, locators)

🧠 Key Features

✅ DRY, KISS, SOLID throughout

✅ Reusable page objects & centralized configuration

✅ Cross-browser / cross-platform ready

✅ Parallel execution with stable synchronization

✅ Version-control hygiene & CI/CD ready (Jenkins-friendly)

⚡ Advantages

✨ Easy to maintain & extend

✨ Reduces complexity, improves readability

✨ Highly scalable & CI/CD ready

✨ Makes testing cleaner, smarter, faster

📦 Getting Started

Prereqs

Node.js ≥ 18 (LTS recommended)

Git

Install

git clone https://github.com/<you>/javaScript-playwrightNative-TAF.git
cd javaScript-playwrightNative-TAF
npm ci
npx playwright install

📁 Project Structure (high-level)
src/
  core/            # BasePage, helpers, fixtures, logger, config
  pages/           # ES6 POMs extending BasePage
tests/
  specifications/  # Playwright specs (TDD)
config/            # env configs
testData/          # Excel/JSON
reports/           # html-report (local) if enabled
allure-results/    # raw allure output (CI reads this)
playwright-report/ # local HTML report (auto from Playwright)

▶️ Run Tests (VS Code Terminal / any terminal)

Windows examples shown; on macOS/Linux, drop the cross-env and use ENV=QA directly.

All tests (Chromium, default workers):

npx cross-env ENV=QA npx playwright test --project=Chromium --workers=4 --reporter=line,html,allure-playwright


Headed mode:

npx cross-env ENV=QA npx playwright test --headed


Filter by title / tag using grep:

npx cross-env ENV=QA npx playwright test --grep "Home Page"


Choose project & workers:

npx cross-env ENV=QA npx playwright test --project=Firefox --workers=2


UI Mode (interactive runner):

npx cross-env ENV=QA npx playwright test --ui


Show local HTML report after run:

npx playwright show-report

🧪 Reports
Playwright HTML (local)

Auto-generated to playwright-report/

Open with:

npx playwright show-report

Allure (local, optional)

On dev machines you can generate and open a local Allure site if you have the CLI.

# produce raw data during test run (already done by --reporter ... allure-playwright)
# then:
npx allure-commandline generate allure-results --clean -o allure-report
npx allure-commandline open allure-report

Allure in Jenkins (recommended)

Install Allure Jenkins Plugin and Allure Commandline tool (Manage Jenkins → Tools → “From Maven Central”).

In pipeline, point the plugin to the raw results:

allure includeProperties: false, results: [[path: 'allure-results']]


Jenkins plugin will generate/publish the Allure site and add an Allure Report link on the job/build page.

Tip: If you ever open index.html from disk (file://) and see endless Loading…, serve it via the Allure CLI or Jenkins plugin instead. Static file loads can be blocked by the browser’s CORS/content-security rules.

🐞 Debugging Guide

1) Playwright Inspector

PWDEBUG=1 npx cross-env ENV=QA npx playwright test --project=Chromium --headed


Opens the Inspector with step-through, locators, and snapshotting.

2) Traces, Screenshots, Videos

This framework already attaches artifacts on failure.

After a run, open a trace:

npx playwright show-trace test-results/<...>/trace.zip


3) Slow down actions

npx cross-env ENV=QA npx playwright test --headed --timeout=60000
# or set slowMo in playwright.config if needed


4) Target a single spec/test

npx cross-env ENV=QA npx playwright test tests/specifications/homePage.spec.js
npx cross-env ENV=QA npx playwright test -g "Verify Header and footer"


5) Extra logging

Adjust log4js level in config (e.g., DEBUG) to get more signal in console + log files.

6) Network/Console troubleshooting

Use page.on('console', ...)/page.on('requestfailed', ...) in Base hooks or a custom reporter to capture issues.

🧰 Handy NPM Scripts (example)
{
  "scripts": {
    "test": "playwright test",
    "test:QA": "cross-env ENV=QA playwright test",
    "test:DEV": "cross-env ENV=DEV playwright test",
    "report": "npx playwright show-report",
    "allure:report": "allure generate allure-results --clean -o allure-report && allure open allure-report"
  }
}


Run with:

npm run test:QA
npm run report
npm run allure:report

🏗️ CI/CD (Jenkins)

Use Node tool or bare Node on agents.

npm ci → npx playwright install → run tests with --reporter=line,html,allure-playwright.

Publish:

Playwright HTML via HTML Publisher (directory playwright-report, file index.html).

Allure via Allure Jenkins Plugin (allure-results input).

Prefer not to fail the pipeline on test failures during early dev: run the test step with returnStatus: true and let Allure show pass/fail while the job remains green.

🙌 Conventions

Small, readable specs

Page Objects hide selectors & flows

One responsibility per module

Keep fixtures dumb and fast

Review logs & traces before changing waits
