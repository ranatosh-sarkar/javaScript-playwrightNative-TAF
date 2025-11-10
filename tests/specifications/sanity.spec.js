const { test, expect, sanityRows } = require('../fixtures');
const Logger     = require('../../src/utils/logger');
const TestUtils  = require('../../src/utils/testUtils');
const HomePage   = require('../../src/pages/home.page');
const SanityPage = require('../../src/pages/sanity.page');

// Optionally parallelize:
// test.describe.configure({ mode: 'parallel' });

test.describe('Sanity - E2E Booking Flow', () => {
  for (const [index, row] of sanityRows.entries()) {
    test(`E2E Booking #${index + 1} (${row.check_in} → ${row.check_out})`, async ({ page }) => {
      const home   = new HomePage(page);
      const sanity = new SanityPage(page);

      await home.expectWelcomeTextVisibility();
      await home.verifyTitle('Restful-booker-platform demo');
      await home.verifyWelcomeText('Welcome to Shady Meadows B&B');

      await home.verifyDefaultCheckinDate('today');
      await home.verifyDefaultCheckoutDate('tomorrow');

      Logger.info(`Running for checkin_date: ${row.check_in}`);
      Logger.info(`Running for checkout_data: ${row.check_out}`);

      await home.setDates(
        TestUtils.toUIDate(row.check_in),
        TestUtils.toUIDate(row.check_out)
      );

      await home.checkAvailability();
      await home.roomBookNow_CheckAvailability();

      await sanity.waitForReservationUrl();
      await sanity.expectRoomHeaderContains(row.single_room, row.double_room, row.suite_room);

      await sanity.clickReserveNow();
      await sanity.fillGuestDetails({
        firstname: row.firstname,
        lastname:  row.lastname,
        email:     row.email,
        phone:     row.phone
      });

      await sanity.submitReservation();
      await sanity.confirmationText();
      await sanity.waitForReservationUrl();
      await expect(sanity.sanityPage_locators.confirmedH2).toBeVisible();
      Logger.info(`✅ E2E booking flow completed successfully for ${row.firstname} ${row.lastname}.`);
    });
  }
});
