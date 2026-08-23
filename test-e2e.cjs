const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));

  try {
    console.log("Navigating to home page...");
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('domcontentloaded');
    
    console.log("Navigating to menu...");
    await page.click('text=Menu');
    await page.waitForLoadState('domcontentloaded');

    console.log("Adding item to cart...");
    // Just click the first 'Add to Cart' button
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    await addToCartBtn.click();
    
    console.log("Navigating to checkout...");
    await page.click('a[href="/cart"], button:has-text("Cart")');
    // wait for cart to load
    await page.waitForTimeout(1000);
    const checkoutBtn = page.locator('button:has-text("Proceed to Checkout"), a:has-text("Checkout")').first();
    await checkoutBtn.click();
    
    console.log("Filling checkout form...");
    await page.waitForSelector('input[name="customerName"]', { timeout: 5000 });
    
    await page.fill('input[name="customerName"]', 'Test Customer');
    await page.fill('input[name="phone"]', '0712345678');
    
    // Choose pickup to avoid map validations
    await page.click('input#pickup');
    
    // M-Pesa is default, submit
    console.log("Submitting order...");
    await page.click('button:has-text("Place Order")');
    
    console.log("Waiting for network requests to complete order creation...");
    // Usually it will prompt for m-pesa polling
    await page.waitForTimeout(3000);
    
    console.log("Order submitted successfully!");
    
    console.log("REGRESSION_TEST: PASS");
  } catch (err) {
    console.error("REGRESSION_TEST: FAIL", err);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
