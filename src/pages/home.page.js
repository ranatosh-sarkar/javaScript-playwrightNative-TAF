const BasePage = require('../core/base.page');
const TestUtils = require('../../src/utils/testUtils'); 
const { expect } = require('@playwright/test'); 

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    // --- Locators ---
    this.homePage_locators = {
      // Hero / welcome
      welcomeH1: this.page.locator('//*[@id="root-container"]/div/section[1]/div/div/div/h1'),

      // Date fields
      checkIn:  this.page.locator("//*[@id='booking']/div/div/div/form/div/div[1]/div/div/input"),
      checkOut: this.page.locator("//*[@id='booking']/div/div/div/form/div/div[2]/div/div/input"),

      // CTA buttons
      btnBookNow:           this.page.getByText('Book Now', { exact: true }),
      btnCheckAvailability: this.page.getByText('Check Availability', { exact: true }),

      // Rooms “Book Now” buttons (1: Single, 2: Double, 3: Suite) – keep XPaths to match your DOM
      btnRoomBookNow_CheckAvailability: this.page.locator('//*[@id="rooms"]/div/div[2]/div[1]/div/div[3]/a'),
      btnSingleBookNow: this.page.locator('//*[@id="rooms"]/div/div[2]/div[1]/div/div[3]/a'),
      btnDoubleBookNow: this.page.locator('//*[@id="rooms"]/div/div[2]/div[2]/div/div[3]/a'),
      btnSuiteBookNow:  this.page.locator('//*[@id="rooms"]/div/div[2]/div[3]/div/div[3]/a'),

      // Contact form submit (footer form on the home page)
      btnFormSubmit: this.page.getByRole('button', { name: 'Submit' }),

      // Header locators (matching your Java XPaths) ---
      headerMainBrand: this.page.locator("//*[@id='root-container']/div/nav/div/a/span"),
      headerRooms:     this.page.locator("//*[@id='navbarNav']/ul/li[1]/a"),
      headerBooking:   this.page.locator("//*[@id='navbarNav']/ul/li[2]/a"),
      headerAmenities: this.page.locator("//*[@id='navbarNav']/ul/li[3]/a"),
      headerLocation:  this.page.locator("//*[@id='navbarNav']/ul/li[4]/a"),
      headerContact:   this.page.locator("//*[@id='navbarNav']/ul/li[5]/a"),
      headerAdmin:     this.page.locator("//*[@id='navbarNav']/ul/li[6]/a"),

      // Footer section headings (matching your Java XPaths) ---
      footerBrand:   this.page.locator("//*[@id='root-container']/div/footer/div/div[1]/div[1]/div/h5 | //*[@id='root-container']/div/footer/div/div[1]/div[1]/h5"),
      footerContact: this.page.locator("//*[@id='root-container']/div/footer/div/div[1]/div[2]/h5"),
      footerLinks:   this.page.locator("//*[@id='root-container']/div/footer/div/div[1]/div[3]/h5"),
    };
  }

  async verifyDefaultCheckinDate(token){
    await TestUtils.scrollIntoView(this.page, this.homePage_locators.btnCheckAvailability);
    const todayUI = TestUtils.toUIDate(token);
    const uiCheckIn = await this.getDefaultCheckIn();
    expect(uiCheckIn).toBe(todayUI);
  }

  async verifyDefaultCheckoutDate(token){
    const tomorrowUI = TestUtils.toUIDate(token);
    const uiCheckOut = await this.getDefaultCheckOut();
    expect(uiCheckOut).toBe(tomorrowUI);
  }

  async getDefaultCheckIn()  { 
    return (await this.homePage_locators.checkIn.inputValue()).trim(); 
  }

  async getDefaultCheckOut() { 
    return (await this.homePage_locators.checkOut.inputValue()).trim(); 
  }

  async verifyHeaderSectionTexts(expected) {
    const {
      header_main,
      rooms, booking, amenities, location, contact, admin
    } = expected;

    await this.expectVisible(this.homePage_locators.headerMainBrand);
    await this.expectVisible(this.homePage_locators.headerRooms);
    await this.expectVisible(this.homePage_locators.headerBooking);
    await this.expectVisible(this.homePage_locators.headerAmenities);
    await this.expectVisible(this.homePage_locators.headerLocation);
    await this.expectVisible(this.homePage_locators.headerContact);
    await this.expectVisible(this.homePage_locators.headerAdmin);

    await this.expectText(this.homePage_locators.headerMainBrand, header_main);
    await this.expectText(this.homePage_locators.headerRooms,     rooms);
    await this.expectText(this.homePage_locators.headerBooking,   booking);
    await this.expectText(this.homePage_locators.headerAmenities, amenities);
    await this.expectText(this.homePage_locators.headerLocation,  location);
    await this.expectText(this.homePage_locators.headerContact,   contact);
    await this.expectText(this.homePage_locators.headerAdmin,     admin);
  }

    async verifyFooterSectionTexts(expected) {
    const { footer_brand, contact_us, quick_links } = expected;
    await TestUtils.scrollIntoView(this.page, this.homePage_locators.footerBrand);
    await this.expectVisible(this.homePage_locators.footerBrand);
    await this.expectVisible(this.homePage_locators.footerContact);
    await this.expectVisible(this.homePage_locators.footerLinks);

    await this.expectText(this.homePage_locators.footerBrand,   footer_brand);
    await this.expectText(this.homePage_locators.footerContact, contact_us);
    await this.expectText(this.homePage_locators.footerLinks,   quick_links);
  }

  async expectWelcomeTextVisibility() {
    await this.expectVisible(this.homePage_locators.welcomeH1);
  }

  async verifyTitle(expected) {
    await this.assertTitle(expected);   // calls BasePage.assertTitle
  }

  async verifyWelcomeText(expected) {
    const actual_welcomeText = await this.getText(this.homePage_locators.welcomeH1);
    await TestUtils.expectExact(actual_welcomeText, expected, 'Welcome text mismatch');
  }

  // Convenience visibility helpers used by the spec (readable steps)
  async isBookNowVisible(expected) { 
    await this.expectVisible(this.homePage_locators.btnBookNow);
    const actual_bookNowText = await this.getText(this.homePage_locators.btnBookNow);
    await TestUtils.expectExact(actual_bookNowText, expected, 'Error at Book Now button');
  }

  async isCheckAvailabilityVisible(expected) { 
    await this.expectVisible(this.homePage_locators.btnCheckAvailability);
    await TestUtils.scrollIntoView(this.page, this.homePage_locators.btnCheckAvailability);
    const actual_checkAvailabilityText = await this.getText(this.homePage_locators.btnCheckAvailability);
    await TestUtils.expectExact(actual_checkAvailabilityText, expected, 'Error at Check Availability button');
  }

  async isSingleBookNowVisible(expected) { 
    await this.expectVisible(this.homePage_locators.btnSingleBookNow);
    await TestUtils.scrollIntoView(this.page, this.homePage_locators.btnSingleBookNow);
    const actual_singleRoomBookNow = await this.getText(this.homePage_locators.btnSingleBookNow);
    await TestUtils.expectExact(actual_singleRoomBookNow, expected, 'Error at Single Room button');
  }

  async isDoubleBookNowVisible(expected) { 
    await this.expectVisible(this.homePage_locators.btnDoubleBookNow);
    // await TestUtils.scrollIntoView(this.page, this.homePage_locators.btnDoubleBookNow);
    const actual_DoubleRoomBookNow = await this.getText(this.homePage_locators.btnDoubleBookNow);
    await TestUtils.expectExact(actual_DoubleRoomBookNow, expected, 'Error at Double Room button');
  }

  async isSuiteBookNowVisible(expected) { 
    await this.expectVisible(this.homePage_locators.btnSuiteBookNow);
    // await TestUtils.scrollIntoView(this.page, this.homePage_locators.btnSuiteBookNow);
    const actual_SuiteBookNow = await this.getText(this.homePage_locators.btnSuiteBookNow);
    await TestUtils.expectExact(actual_SuiteBookNow, expected, 'Error at Suite button');
  }

  async isFormSubmitVisible(expected)        { 
    await this.expectVisible(this.homePage_locators.btnFormSubmit);
    await TestUtils.scrollIntoView(this.page, this.homePage_locators.btnFormSubmit);
    const actual_FormSubmitBtn = await this.getText(this.homePage_locators.btnFormSubmit);
    await TestUtils.expectExact(actual_FormSubmitBtn, expected, 'Error at Form Submit button');
  }

  async setDates(checkInStr, checkOutStr) {
    await this.fillWhenVisible(this.homePage_locators.checkIn, checkInStr);
    await TestUtils.pressTab(this.page);
    await this.fillWhenVisible(this.homePage_locators.checkOut, checkOutStr);
    await TestUtils.pressTab(this.page);
  }

  async checkAvailability() {
    await this.clickWhenVisible(this.homePage_locators.btnCheckAvailability);
  }

  // Room flows (we keep only “Single” for the sanity flow; others for visibility checks)
  async roomBookNow_CheckAvailability() { 
    await this.clickWhenVisible(this.homePage_locators.btnRoomBookNow_CheckAvailability); 
  }


  }

module.exports = HomePage;
