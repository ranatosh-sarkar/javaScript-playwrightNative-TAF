const BasePage = require('../core/base.page');
const TestUtils = require('../../src/utils/testUtils');
const { expect } = require('@playwright/test'); 

class SanityPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.sanityPage_locators = {
      // “Single Room” page header (title/headline on the reservation page)
      singleRoomH1: this.page.locator('//*[@id="root-container"]//div[1]/div[1]/h1'),

      // Booking form fields (your requested XPaths)
      firstName: this.page.locator("//*[@id='root-container']/div/div[2]/div/div[2]/div/div/form/div[1]/input"),
      lastName:  this.page.locator("//*[@id='root-container']/div/div[2]/div/div[2]/div/div/form/div[2]/input"),
      email:     this.page.locator("//*[@id='root-container']/div/div[2]/div/div[2]/div/div/form/div[3]/input"),
      phone:     this.page.locator("//*[@id='root-container']/div/div[2]/div/div[2]/div/div/form/div[4]/input"),

      // Buttons / confirmation
      btnReserveNow: this.page.locator("//*[@id='root-container']/div/div[2]/div/div[2]/div/div/form/button[1]"),
      confirmedH2:   this.page.locator("//*[@id='root-container']/div/div[2]/div/div[2]/div/div/h2"),
    };
  }

  // --- waits/asserts on reservation page ---
  async waitForReservationUrl() {
    await this.page.waitForURL(/\/reservation\//, { timeout: this.defaultTimeout });
  }

async expectRoomHeaderContains(single, double, suite) {
  await this.expectVisible(this.sanityPage_locators.singleRoomH1);

  const headerText = await this.getText(this.sanityPage_locators.singleRoomH1);

  const isMatch =
    headerText.includes(single) ||
    headerText.includes(double) ||
    headerText.includes(suite);

  expect(isMatch).toBeTruthy(); 
}

  async clickReserveNow() { await this.clickWhenVisible(this.sanityPage_locators.btnReserveNow); }

  async fillGuestDetails({ firstname, lastname, email, phone }) {
    await TestUtils.scrollIntoView(this.page, this.sanityPage_locators.firstName);
    await this.fillWhenVisible(this.sanityPage_locators.firstName, firstname);
    await this.fillWhenVisible(this.sanityPage_locators.lastName,  lastname);
    await this.fillWhenVisible(this.sanityPage_locators.email,     email);
    await this.fillWhenVisible(this.sanityPage_locators.phone,     phone);
    await TestUtils.pressTab(this.page);
  }

  // On this site the same button often acts as “Reserve/Submit”.
  async submitReservation() { await this.clickWhenVisible(this.sanityPage_locators.btnReserveNow); }

  async confirmationText() {
    await this.pause();
    const confText = (await this.getText(this.sanityPage_locators.confirmedH2)).toLowerCase();
    expect(confText).toContain('booking confirmed');
  }
}

module.exports = SanityPage;
