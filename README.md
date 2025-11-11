# 💻 Playwright Native Test Automation Framework (JS)

A lean, opinionated **Playwright + JavaScript (TDD)** framework that stays clean, fast, and CI-ready.  
It follows **DRY / KISS / SOLID**, uses simple **ES6 Page Objects**, and ships with truthful logs and reports.

---

## ⚙️ Tech Stack

- **Engine:** Playwright core (no external WebDriver)
- **Build & Deps:** npm + `package.json`
- **Runner:** Playwright Test (`test`, `test.beforeEach`, projects/workers for parallel)
- **Style:** TDD (you can layer BDD later)
- **POM:** ES6 classes in `src/pages/` extending `BasePage`
- **Reporting:** Playwright HTML (local) + Allure (via Jenkins plugin / CLI)
- **Logging:** `log4js` (+ optional Playwright listeners/custom reporter)
- **Test Data:** Excel/JSON via `excelRead.js`; specs consume via **fixtures**
- **Env config:** `.env` + `config/config.json` via a **ConfigManager**

**Patterns**
- **Singleton:** Config, Logger  
- **Observer:** listeners / custom reporter for events  
- **Factory:** _not needed_ — Playwright selects browser via CLI/projects

---

## 🧩 The 5 Pillars of a SOLID TAF

### 1️⃣ Clean Architecture Layering
a) Build & Dependencies · b) Configuration · c) Core/Base · d) Tests & Page Objects · e) Utilities (fixtures, reporters, CI hooks)

### 2️⃣ Design Patterns That Serve The Framework
Singleton (config/logging) · Observer (telemetry/reporting) · POM (stable, intention‑revealing interactions)

### 3️⃣ Logs & Reports That Tell The Truth
Real-time `log4js` + artifacts (traces, screenshots, videos)

### 4️⃣ Test Data Done Right
Excel/JSON → typed access in fixtures (no hard-coded data/secrets)

### 5️⃣ Parallel & Scale By Default
Projects/workers + stable sync (auto-waits, strict locators)

---

## 🧠 Key Features

- ✅ DRY, KISS, SOLID throughout  
- ✅ Reusable page objects & centralized configuration  
- ✅ Cross-browser / cross-platform ready  
- ✅ Parallel execution with stable synchronization  
- ✅ Version-control hygiene & CI/CD ready (Jenkins-friendly)

---

## 📦 Getting Started

### Prerequisites
- Node.js **≥ 18** (LTS recommended)  
- Git

### Install
```bash
git clone https://github.com/<you>/javaScript-playwrightNative-TAF.git
cd javaScript-playwrightNative-TAF
npm ci
npx playwright install --with-deps
```

> If you plan to use environment flags like `ENV=QA`, install **cross-env**:  
> `npm i -D cross-env`

### Run
```bash
# Headed mode (example using ENV)
npx cross-env ENV=QA playwright test --headed

# Filter by title or tag with grep
npx cross-env ENV=QA playwright test --grep "Home Page"

# Choose project and workers
npx cross-env ENV=QA playwright test --project=chromium --workers=2

# UI mode (interactive)
npx cross-env ENV=QA playwright test --ui

# Open Playwright HTML report after a run
npx playwright show-report
```

---

## 🧪 Reports

### Playwright HTML (local)
Auto-generated to **playwright-report/**. Open with:
```bash
npx playwright show-report
```

### Allure (local optional)
Raw data is produced by setting the reporter to include **allure-playwright**.  
Example config snippet:
```js
// playwright.config.js
reporter: [
  ['line'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['allure-playwright']
],
use: {
  trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'retain-on-failure'
}
```

Generate & open:
```bash
npx allure-commandline generate allure-results --clean -o allure-report
npx allure-commandline open allure-report
```

### Allure in Jenkins (recommended)
- Install **Allure Jenkins Plugin** and **Allure Commandline**  
- Pipeline snippet to publish:
```groovy
allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
```

> Tip: Serve reports via CLI/CI rather than opening `index.html` from disk to avoid browser CSP issues.

---

## 🐞 Debugging Guide

1) **Playwright Inspector**
```bash
PWDEBUG=1 npx cross-env ENV=QA playwright test --project=chromium --headed
```
2) **Traces, Screenshots, Videos**
```bash
npx playwright show-trace test-results/**/trace.zip
```
3) **Slow down actions**
```bash
npx cross-env ENV=QA playwright test --headed --timeout=60000
# or configure slowMo in playwright.config.ts/js
```
4) **Target a single spec or test**
```bash
npx cross-env ENV=QA playwright test tests/specifications/homePage.spec.js
npx cross-env ENV=QA playwright test -g "Verify header"
```
5) **Extra logging**
Set log level in `log4js.json` (e.g., DEBUG).  
6) **Network/console**
```js
page.on('console', msg => {/* ... */});
page.on('requestfailed', req => {/* ... */});
```

---

## 🧰 Handy NPM Scripts (example)
```json
{
  "scripts": {
    "test": "playwright test",
    "test:QA": "cross-env ENV=QA playwright test",
    "test:DEV": "cross-env ENV=DEV playwright test",
    "report": "playwright show-report",
    "allure:report": "allure-commandline generate allure-results --clean -o allure-report && allure-commandline open allure-report"
  }
}
```

Run with:
```bash
npm run test:QA
npm run report
npm run allure:report
```

---

## 🏗️ CI/CD (Jenkins)

**Agent setup**
```bash
npm ci
npx playwright install --with-deps
```

**Run tests**
```bash
npx cross-env ENV=QA playwright test --reporter=line,html,allure-playwright
```

**Publish**

- **HTML Publisher**  
  - Directory: `playwright-report`  
  - Index: `index.html`

- **Allure Jenkins Plugin**  
  - Results: `allure-results`

> During early development, you can keep the job green and still see failures in reports by publishing reports from post steps. Avoid masking failures long term.

---

## 🙌 Conventions

- Small, readable specs
- Page Objects hide selectors & flows
- One responsibility per module
- Keep fixtures dumb and fast
- Prefer **getByRole/testId** locators; avoid brittle CSS where possible
- Review logs & traces before changing waits

---

## 📁 Project Structure (high level)
```
PLAYWRIGHTNATIVE/
├─ .vscode/
│  └─ launch.json
├─ allure-results/
├─ config/
│  ├─ .env
│  └─ config.json
├─ logs/
├─ node_modules/
├─ reports/
│  └─ html-report/
│     └─ index.html
├─ src/
│  ├─ core/
│  │  └─ base.page.js
│  ├─ pages/
│  └─ utils/
│     ├─ configManager.js
│     ├─ excelRead.js
│     ├─ logger.js
│     └─ testUtils.js
├─ test-results/
├─ testData/
│  └─ testData.xlsx
├─ tests/
│  ├─ specifications/
│  │  ├─ homePage.spec.js
│  │  ├─ sanity.spec.js
│  │  └─ smoke.spec.js
│  └─ fixtures.js
├─ .gitignore
├─ Jenkinsfile
├─ package-lock.json
├─ package.json
└─ playwright.config.js
```

---
