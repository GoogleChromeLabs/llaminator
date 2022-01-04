// Building the website and starting the server takes ~7 seconds on a MacBook Pro.
jest.setTimeout(15000);

describe('Homepage', () => {
  beforeAll(async () => {
    // The port here must match that in //jest-puppeteer.config.js.
    await page.goto('http://localhost:8888', { 'waitUntil': 'domcontentloaded' });
  })

  it('says Llaminator', async () => {
    // Note: There is a bug with puppeteer/jest-puppeteer that will cause this test to
    // fail if run with puppeteer 13.
    // See https://github.com/smooth-code/jest-puppeteer/issues/461.
    await expect(page).toMatch('Llaminator');
  })
})
