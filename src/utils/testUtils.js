const { expect } = require('@playwright/test');

class TestUtils {

  static toISODate(token) {
    const d = this._moveByToken(new Date(), token);
    return d.toISOString().split('T')[0];
  }

  static toUIDate(token) {
    const d = this._moveByToken(new Date(), token);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }

  static _moveByToken(date, token = '') {
    const t = String(token || '').toLowerCase();
    const d = new Date(date);
    if (t === 'tomorrow') d.setDate(d.getDate() + 1);
    else if (t.startsWith('plus_')) {
      const n = parseInt(t.split('_')[1], 10) || 0;
      d.setDate(d.getDate() + n);
    } // 'today' or unknown => no change
    return d;
  }

  static async pressTab(page) {
    try {
      await page.keyboard.press('Tab');
    } catch (error) {
      console.error(`[TestUtils] Error pressing Tab: ${error.message}`);
    }
  }
  
  static async waitForURLContains(fragment) {
    const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await this.page.waitForURL(new RegExp(escaped), { timeout: this.defaultTimeout });
  }

    // Exact, case-sensitive string comparison
  static async expectExact(actual, expected, message) {
    await expect(actual, message ?? `Strings differ`).toBe(expected);
  }

  // Boolean version string comparison
  static equalsExact(actual, expected) {
    return String(actual) === String(expected);
  }
  
  // Page-level helpers
  static async waitForNetworkIdle()   { 
    await this.page.waitForLoadState('networkidle', { timeout: this.defaultTimeout }); 
  }

  // Scroll element into view using Playwright locator
static async scrollIntoView(page, locator) {
  try {
    const elementHandle =
      typeof locator === 'string' ? page.locator(locator) : locator;

    await elementHandle.scrollIntoViewIfNeeded();
    console.log(`[Scroll] Element scrolled into view.`);
  } catch (err) {
    console.error(`Scroll failed for locator: ${locator}`, err);
  }
}

  // Alternative using JavaScript (works with both string and locator)
  static async scrollWithJS(page, locator) {
    let elementHandle;
    if (typeof locator === 'string') {
      elementHandle = await page.$(locator);
    } else {
      elementHandle = await locator.elementHandle();
    }

    if (elementHandle) {
      await page.evaluate((el) => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, elementHandle);
    } else {
      console.warn(`Element not found to scroll: ${locator}`);
    }
  }

  // Scroll to bottom of the page
  static async scrollToBottom(page) {
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    );
  }

  // Scroll to top of the page
  static async scrollToTop(page) {
    await page.evaluate(() =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

}

module.exports = TestUtils;
