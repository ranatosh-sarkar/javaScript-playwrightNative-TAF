📘 Ready-to-Use Test Automation Framework (TAF)
🌟 Introducing the Lean Playwright Test Automation Framework

The goal is to reduce complexity, improve maintainability, and make every layer easy for anyone to pick up.
It’s built to be clean, scalable, and future-ready — so you can build, debug, and scale fast.

🧰 Technologies Used

Playwright core — built-in browser control (no external driver)

Runner: Playwright Test (projects/workers for parallel)

Build & Deps: npm + package.json

Style: TDD with native specs (BDD can be layered later)

POM: ES6 classes in src/pages extending BasePage

Reporting: Playwright HTML (local) + Allure (via Jenkins plugin)

Logging: log4js (+ custom hooks/reporters)

Test Data: Excel/JSON via excelRead.js, injected via fixtures

🧱 The 5 Pillars of a Solid TAF
1️⃣ Clean Architecture Layering

Clear separation → independence, maintainability, readability:

Build & Dependency Management

Configuration Layer

Core/Base Classes

Test & Page Objects

Utility & Execution Layers (fixtures, reporters, CI hooks)

2️⃣ Design Patterns that Serve the Framework

Singleton — stable Config & Logger

Observer — listeners/custom reporter for events & telemetry

POM — intention-revealing interactions; UI logic isolated

3️⃣ Logs & Reports that Tell the Truth

Real-time log4js logs (console + file)

Playwright HTML report for quick local triage

Allure report for rich history in Jenkins

4️⃣ Test Data Done Right

Externalized data (Excel/JSON) via a single data access layer

Reusable fixtures to inject data per test/suite

Deterministic seeds for reproducible runs

5️⃣ Parallel & Scale by Default

Cross-browser, cross-platform ready

Stable synchronization & retries where they add value

CI-first: fast feedback, minimal flake

📂 Project Structure (excerpt)
├─ config/                 # env configs, test options
├─ src/
│  ├─ core/               # BasePage, helpers, wrappers
│  ├─ pages/              # Page Objects (ES6 classes)
│  └─ utils/              # logger, data readers, date ops
├─ tests/
│  ├─ specifications/     # spec files (TDD style)
│  └─ fixtures.js         # data/fixtures wiring
├─ reports/ html-report/  # Playwright HTML (local)
├─ allure-results/        # Allure raw artifacts
├─ playwright.config.js
└─ package.json

▶️ How to Run (VS Code terminal or any shell)

Install & prepare

npm ci
npx playwright install


Run everything (default project):

npx playwright test --reporter=line,html,allure-playwright


Run a single project (e.g., Chromium):

npx playwright test --project=Chromium --reporter=line,html,allure-playwright


Run headed / control workers:

npx playwright test --headed --workers=4 --reporter=line,html,allure-playwright


Grep by title (include / exclude):

# include
npx playwright test --grep "Home Page"
# exclude
npx playwright test --grep-invert "flaky|skip"


Open the last HTML report:

npx playwright show-report

🧪 Environment & Data

Switch ENV at runtime:

cross-env ENV=QA npx playwright test


ENV is consumed by configManager (Singleton) and your fixtures.

Excel / JSON data:

Put test data in testData/ (Excel or JSON).

Access via excelRead.js and typed mappers.

Inject using fixtures.js to keep specs clean.

🪵 Logging (log4js)

Console + rolling file appender (timestamped).

Per-spec correlation id for easy grepping in CI logs.

Failure context is captured alongside Playwright traces.

📊 Reports
Local: Playwright HTML

Auto-generated to playwright-report/.

Open with npx playwright show-report.

CI: Allure (via Jenkins)

Specs emit allure-results automatically (allure-playwright).

Jenkins Allure plugin consumes allure-results/ and renders a rich report.

Artifacts archived for each build.

🧰 Debugging Guide

1) Headed + slowMo

PWDEBUG=0 npx playwright test --headed --debug
# or
npx playwright test --headed --timeout=60000 --retries=0


2) Pause in Inspector

// inside a spec
await page.pause();


Then run:

npx playwright test --debug


3) Open a failed test trace

npx playwright show-trace test-results/<folder>/trace.zip


4) Increase logs

Set logger level in logger.js (info/debug/trace).

Add DEBUG=pw:api to see Playwright API logs.

🧵 Helpful Commands (copy-paste)
# All tests, Chromium, 4 workers, with Allure artifacts
npx playwright test --project=Chromium --workers=4 --reporter=line,html,allure-playwright

# Only a suite by title
npx playwright test -g "Sanity - E2E Booking Flow"

# Retry on failure (local)
npx playwright test --retries=1

# Clean previous reports
rimraf allure-results allure-report playwright-report

🚀 CI/CD (Jenkins-Friendly)

Node setup: npm ci → npx playwright install

Run tests with --reporter=line,html,allure-playwright

Archive artifacts: playwright-report/**, allure-results/**

Allure plugin step:

allure results: [[path: 'allure-results']], includeProperties: false


(Optional) Also publish the generated HTML:

publishHTML(target: [reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright HTML Report'])

✨ Why This TAF?

DRY, KISS, SOLID applied consistently

Reusable Page Objects & centralized config

Cross-browser, parallel by default

Scales cleanly into CI/CD with Allure & artifacts

Easy to read, easy to change — the core of maintainability
