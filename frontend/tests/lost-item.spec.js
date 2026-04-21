import { test, expect } from '@playwright/test';

/**
 * Playwright test for the Lost Item Reporting Module
 * 
 * To run this test:
 * 1. Ensure the backend is running on http://localhost:5000
 * 2. Ensure the frontend is running on http://localhost:5173
 * 3. Run: npx playwright test tests/lost-item.spec.js
 */

test.describe('Lost Item Reporting Module', () => {
  
  test.beforeEach(async ({ page }, testInfo) => {
    // Log console errors
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`PAGE ERROR: ${msg.text()}`);
    });

    const timestamp = Date.now();
    const workerId = testInfo.workerIndex;
    const randomSuffix = Math.floor(Math.random() * 1000);
    const email = `testuser_${timestamp}_${workerId}_${randomSuffix}@example.com`;
    const password = 'password123';
    // Ensure studentId is exactly 10 characters and unique
    const studentId = `IT${String(timestamp).slice(-5)}${workerId}${randomSuffix}`.padEnd(10, '0').slice(0, 10);

    // Go to registration
    await page.goto('/register');
    await page.fill('input[placeholder="e.g. IT23543964"]', studentId);
    await page.fill('input[placeholder="Pasindu Nirmal"]', 'Test User');
    await page.fill('input[placeholder="it23543964@my.sliit.lk"]', email);
    await page.fill('input[placeholder="Min. 6 characters"]', password);
    await page.fill('input[placeholder="Repeat password"]', password);
    
    await page.click('button:has-text("Create Account")');
    
    // Wait for the dashboard or check for registration error
    const errorLocator = page.locator('div.bg-danger-50');
    try {
      await page.waitForURL('**/dashboard', { timeout: 20000 });
    } catch (e) {
      if (await errorLocator.isVisible()) {
        const errorMsg = await errorLocator.innerText();
        console.error('Registration failed with error:', errorMsg);
        throw new Error(`Registration failed: ${errorMsg}`);
      }
      throw e;
    }
  });

  test('should successfully report a lost item', async ({ page }) => {
    // Navigate to the Lost Items page
    await page.goto('/lost');

    // Ensure the "Report Lost Item" button is visible and click it
    const reportBtn = page.locator('#report-lost-btn');
    await expect(reportBtn).toBeVisible();
    await reportBtn.click();

    // Fill out the Lost Item Form
    await page.fill('#lost-title', 'Test Lost Item');
    await page.fill('#lost-description', 'This is a test description for a lost item.');
    await page.selectOption('#lost-category', 'Electronics');
    await page.fill('#lost-dateLost', new Date().toISOString().split('T')[0]);
    await page.fill('#lost-location', 'Test Location');
    await page.fill('#lost-color', 'Red');
    await page.fill('#lost-brand', 'Test Brand');

    // Submit the form
    const submitBtn = page.locator('#lost-submit-btn');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify the success message
    const successToast = page.locator('text=Lost item posted successfully!');
    const formModal = page.locator('div.fixed.inset-0.bg-black\\/40'); // The modal background
    
    try {
      await expect(successToast).toBeVisible({ timeout: 10000 });
    } catch (e) {
      // If toast not found, check if modal is still open with an error
      const formError = page.locator('div.bg-red-50.border-red-200');
      if (await formError.isVisible()) {
        const msg = await formError.innerText();
        throw new Error(`Item submission failed with error: ${msg}`);
      }
      throw e;
    }
    
    // Ensure modal is closed
    await expect(formModal).not.toBeVisible();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Navigate to the Lost Items page
    await page.goto('/lost');

    // Click Report Lost Item button
    await page.click('#report-lost-btn');

    // Try to submit the form without filling any data
    await page.click('#lost-submit-btn');

    // Check for validation error messages
    await expect(page.locator('text=Item Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
    await expect(page.locator('text=Date Lost is required')).toBeVisible();
    await expect(page.locator('text=Location is required')).toBeVisible();
  });

  test('should block special characters in title and description', async ({ page }) => {
    // Navigate to the Lost Items page
    await page.goto('/lost');

    // Click Report Lost Item button
    await page.click('#report-lost-btn');

    // Type a title with special characters
    await page.fill('#lost-title', 'My Item @#$%');
    
    // Check for the error message (as defined in your React code)
    await expect(page.locator('text=Can not use special characters')).toBeVisible();
  });

});
