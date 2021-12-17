// The initial page loads takes ~7 seconds on my machine.
jest.setTimeout(15000);

describe('Homepage', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8888', { 'waitUntil': 'domcontentloaded' });
  })

  it('say Llaminator', async () => {
    // Note: There is a bug with puppeteer/jest-puppeteer that will cause this test to
    // fail if run with puppeteer 13.
    // See https://github.com/smooth-code/jest-puppeteer/issues/461.
    await expect(page).toMatch('Llaminator');
  })
})
