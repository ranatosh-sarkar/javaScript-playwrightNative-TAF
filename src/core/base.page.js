const Config = require('../utils/configManager'); 
const { expect } = require('@playwright/test'); 

class BasePage { 
  /** @param {import('@playwright/test').Page} page */ 
  
  constructor(page) { 
    this.page = page; 
  } 

    // ---------- GLOBAL LOCATOR HELPERS ----------
  // Use these from any page class
  static isLocator(t) {
    return !!t
      && typeof t === 'object'
      && typeof t.locator === 'function'
      && typeof t.first   === 'function'
      && typeof t.nth     === 'function';
  }

  // Validate and return the Locator (or throw)
  asLocator(target) {
    if (BasePage.isLocator(target)) return target;
    throw new Error(`Expected a Playwright Locator, got: ${String(target)}`);
  }
  
  static _defaultTimeout() { 
    const t = Config.get?.('defaultTimeout'); return typeof t === 'number' ? t : 10000; 
  }

  async pause(ms = 10000) {
    try {
      await new Promise(resolve => setTimeout(resolve, ms));
      console.log(`[TestUtils] Paused for ${ms / 1000} seconds`);
      } catch (error) {
        console.error(`[TestUtils] Error during pause: ${error.message}`);
    }
  }

  async expectHidden(locator, timeout) {
    await expect(locator).toBeHidden({ timeout: timeout ?? this.defaultTimeout });
  }

  async expectText(locator, valueOrRegex, timeout) {
    await expect(locator).toHaveText(valueOrRegex, { timeout: timeout ?? this.defaultTimeout });
  }

  async expectValue(locator, value, timeout) {
    await expect(locator).toHaveValue(value, { timeout: timeout ?? this.defaultTimeout });
  }

  async assertTitle(expected, options = {}) {
    await expect(this.page).toHaveTitle(expected, options);
  }

  // ---- Navigation (uses Playwright baseURL) ----
  async goto(path = '/', waitState = 'domcontentloaded') {
    await this.page.goto(path, { waitUntil: waitState, timeout: this.defaultTimeout });
  }

  // ---- Explicit-wait style helpers ----
  async waitVisible(locator, timeout) {
    await locator.waitFor({ state: 'visible', timeout: timeout ?? this.defaultTimeout });
  }

  async expectVisible(locator, timeout) {
    await expect(locator).toBeVisible({ timeout: timeout ?? this.defaultTimeout });
  }

  async waitHidden(locator, timeout) {
    await locator.waitFor({ state: 'hidden', timeout: timeout ?? this.defaultTimeout });
  }

  async clickWhenVisible(locator, timeout) {
    await this.waitVisible(locator, timeout);
    await locator.click({ timeout: timeout ?? this.defaultTimeout });
  }

  async fillWhenVisible(locator, text, timeout) {
    const safeValue = text?.toString() ?? '';
    await this.waitVisible(locator, timeout);
    await locator.fill(safeValue, { timeout: timeout ?? this.defaultTimeout });
  }

  async trimText(locator) {
    return (await locator.textContent())?.trim();
  }

  async click(locator) {
    await this.page.locator(locator).click();
  }

  async type(locator, text) {
    await this.page.locator(locator).fill(text);
  }

async getText(locator) {
  // Handle both: string selector or Playwright Locator
  if (typeof locator === 'string') {
    return await this.page.locator(locator).textContent();
  } else {
    return await locator.textContent();
  }
}

}

module.exports = BasePage;
