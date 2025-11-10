const { test, expect } = require('../fixtures');
const Logger    = require('../../src/utils/logger');
const HomePage  = require('../../src/pages/home.page');
const TestUtils = require('../../src/utils/testUtils'); 

test.describe('Smoke: Verifying Home page', () => {

  test('Verify Core UI elements - Smoke Test', async ({ page, homeData }) => {
    const home = new HomePage(page);

    // 1) Assert whether page is loaded by checking a key element
    await home.expectWelcomeTextVisibility();
    Logger.info('Landed 0n Home Page Now!');

    // 2) Verify the page title
    await home.verifyTitle(homeData.expected_title);

    // 3) Verify welcome text
    await home.verifyWelcomeText(homeData.welcome_text);
    Logger.info(`Welcome Text - '${homeData.welcome_text}' is visible`);

    // 4) Verify “Book Now” button is present
    await home.isBookNowVisible(homeData.btn_book_now);
    Logger.info(`Book Now - '${homeData.btn_book_now}' is present`);

    // 5) Verify “Check Availability” button
    await home.isCheckAvailabilityVisible(homeData.btn_check_availability);
    Logger.info(`Check Availability - '${homeData.btn_check_availability}' is present`);

    // 6) Verify “Single Room – Book Now” button
    await home.isSingleBookNowVisible(homeData.btn_single_book_now);
    Logger.info(`Single Book Now Button - '${homeData.btn_single_book_now}' is present`);

    // 7) Verify “Double Room – Book Now” button
    await home.isDoubleBookNowVisible(homeData.btn_double_book_now);
    Logger.info(`Double Book Now - '${homeData.btn_double_book_now}' is present`);

    // 8) Verify “Suite Room – Book Now” button
    await home.isSuiteBookNowVisible(homeData.btn_suite_book_now);
    Logger.info(`Suite Book Now - '${homeData.btn_suite_book_now}' is present`);

    // 9) Verify “Form Submit” button
    await home.isFormSubmitVisible(homeData.btn_form_submit);
    Logger.info(`Form Submit - '${homeData.btn_form_submit}' is present`);

    Logger.info('Mandatory Core UI elements validated successfully.');

    // 10) Verify header navigation links (texts from Excel) --> add scroll up
    await TestUtils.scrollToTop(page);
    await home.verifyHeaderSectionTexts({
      header_main: homeData.header_main,
      rooms:       homeData.rooms,
      booking:     homeData.booking,
      amenities:   homeData.amenities,
      location:    homeData.location,
      contact:     homeData.contact,
      admin:       homeData.admin
    });
    Logger.info(`Header Section is visible`);

    // 11) Verify footer navigation links (texts from Excel)
    await home.verifyFooterSectionTexts({
      footer_brand: homeData.footer_brand,
      contact_us:   homeData.contact_us,
      quick_links:  homeData.quick_links
    });
    Logger.info(`Footer Section is visible`);

    Logger.info('Header and footer navigation sections validated successfully.');

    // 12) Default Check-In = today (dd/MM/yyyy)
    await home.verifyDefaultCheckinDate('today');

    // 13) Default Check-Out = tomorrow (dd/MM/yyyy)
    await home.verifyDefaultCheckoutDate('tomorrow');

    Logger.info(`Smoke Test Completed Successfully`);
  });

});
