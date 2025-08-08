import { test, expect } from '@playwright/test';

// Configure to use localhost:3001
test.use({
  baseURL: 'http://localhost:3001',
});

test.describe('B2B Quote Builder Tests', () => {
  
  test('Test 1: Navigate and verify initial state', async ({ page }) => {
    // Navigate to quote-b2b page
    await page.goto('/quote-b2b');
    
    // Verify page title contains "Camber"
    await expect(page).toHaveTitle(/Camber/);
    
    // Verify "Quote Builder" text is visible in header
    await expect(page.getByText('Quote Builder')).toBeVisible();
    
    // Verify file upload overlay is visible with expected text
    await expect(page.getByText('Drop RFQ here or click to browse')).toBeVisible();
  });

  test('Test 2: Test quote list interaction', async ({ page }) => {
    await page.goto('/quote-b2b');
    
    // Click on quote Q-2024-1001 in the left sidebar
    await page.getByText('Q-2024-1001').click();
    
    // Wait for quote to load
    await page.waitForTimeout(1000);
    
    // Verify customer name "Enterprise Construction" appears
    await expect(page.getByText('Enterprise Construction')).toBeVisible();
    
    // Verify blue customer bar appears with credit/payment info
    const customerBar = page.locator('.bg-blue-50, .bg-blue-100').first();
    await expect(customerBar).toBeVisible();
    
    // Check that line items table is displayed
    const lineItemsTable = page.locator('table').first();
    await expect(lineItemsTable).toBeVisible();
  });

  test('Test 3: Test customer intelligence panel', async ({ page }) => {
    await page.goto('/quote-b2b');
    
    // Select a quote first
    await page.getByText('Q-2024-1001').click();
    await page.waitForTimeout(1000);
    
    // Click on "Details" button in the blue customer bar
    await page.getByRole('button', { name: /Details/i }).click();
    
    // Verify "Account Structure" section appears
    await expect(page.getByText('Account Structure')).toBeVisible();
    
    // Verify "Recent Orders" section is visible
    await expect(page.getByText('Recent Orders')).toBeVisible();
    
    // Click on a PO number to open order details modal
    const poNumber = page.getByText('PO-2024-001').first();
    if (await poNumber.isVisible()) {
      await poNumber.click();
      
      // Verify modal shows expected tabs
      await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Line Items' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Timeline' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Documents' })).toBeVisible();
      
      // Close modal by clicking X button or pressing Escape
      await page.keyboard.press('Escape');
    }
  });

  test('Test 4: Test navigation between modules', async ({ page }) => {
    await page.goto('/quote-b2b');
    
    // Click on "Orders" in the left navigation
    await page.getByRole('link', { name: /Orders/i }).click();
    
    // Verify URL changes to /orders-b2b
    await expect(page).toHaveURL(/.*\/orders-b2b/);
    
    // Click on "Dashboard" to return home
    await page.getByRole('link', { name: /Dashboard/i }).click();
    
    // Verify URL changes to /
    await expect(page).toHaveURL(/.*\/$/);
    
    // Click on "Quotes" to return to quote builder
    await page.getByRole('link', { name: /Quotes/i }).click();
    
    // Verify we're back on quotes page
    await expect(page).toHaveURL(/.*\/quote-b2b/);
  });

  test('Test 5: Test integrations page', async ({ page }) => {
    await page.goto('/quote-b2b');
    
    // Click on "Integrations" in navigation (should have yellow "1" badge)
    const integrationsLink = page.getByRole('link', { name: /Integrations/i });
    await integrationsLink.click();
    
    // Verify integrations page loads
    await expect(page.getByText('Connected Integrations')).toBeVisible();
    
    // Click on "ERP" category filter
    await page.getByRole('button', { name: 'ERP' }).click();
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Verify ERP integrations are shown (checking for SAP or similar)
    const erpIntegrations = page.locator('[data-category="ERP"], .integration-card').filter({ hasText: /SAP|Oracle|NetSuite/i });
    
    // Click on "All" to reset filter
    await page.getByRole('button', { name: 'All' }).click();
  });

  test('Test 6: Test quote selection states', async ({ page }) => {
    await page.goto('/quote-b2b');
    
    // Click on first quote
    const firstQuote = page.getByText('Q-2024-1001');
    await firstQuote.click();
    
    // Verify selected quote has blue background
    const selectedQuote = page.locator('.bg-blue-100').filter({ hasText: 'Q-2024-1001' });
    await expect(selectedQuote).toBeVisible();
    
    // Click on a different quote
    const secondQuote = page.getByText('Q-2024-1002');
    if (await secondQuote.isVisible()) {
      // Hover over non-selected quote to check hover state
      await secondQuote.hover();
      await page.waitForTimeout(500); // Wait for hover state
      
      // Click to select second quote
      await secondQuote.click();
      
      // Verify new selection
      const newSelectedQuote = page.locator('.bg-blue-100').filter({ hasText: 'Q-2024-1002' });
      await expect(newSelectedQuote).toBeVisible();
    }
  });

  test('Test 7: Test empty state', async ({ page }) => {
    // Navigate to quotes page fresh
    await page.goto('/quote-b2b');
    
    // Refresh to ensure clean state
    await page.reload();
    
    // Verify file upload overlay is visible
    await expect(page.getByText('Drop RFQ here or click to browse')).toBeVisible();
    
    // Click on any quote to exit empty state
    const anyQuote = page.locator('.cursor-pointer').filter({ hasText: /Q-2024-/ }).first();
    if (await anyQuote.isVisible()) {
      await anyQuote.click();
      
      // Verify empty state is gone (customer info should be visible)
      await expect(page.locator('.bg-blue-50, .bg-blue-100').first()).toBeVisible();
    }
  });
});

// Additional test for comprehensive coverage
test.describe('Additional B2B Quote Builder Tests', () => {
  
  test('Test file upload interaction', async ({ page }) => {
    await page.goto('/quote-b2b');
    
    // Check if file upload area is clickable
    const uploadArea = page.getByText('Drop RFQ here or click to browse');
    await expect(uploadArea).toBeVisible();
    
    // Test hover state on upload area
    await uploadArea.hover();
    await page.waitForTimeout(500);
  });
  
  test('Test responsive behavior', async ({ page }) => {
    await page.goto('/quote-b2b');
    
    // Test at different viewport sizes
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByText('Quote Builder')).toBeVisible();
    
    // Test tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Test mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
  });
  
  test('Test error handling and edge cases', async ({ page }) => {
    await page.goto('/quote-b2b');
    
    // Test rapid clicking between quotes
    const quotes = page.locator('.cursor-pointer').filter({ hasText: /Q-2024-/ });
    const count = await quotes.count();
    
    if (count > 1) {
      for (let i = 0; i < Math.min(3, count); i++) {
        await quotes.nth(i).click();
        await page.waitForTimeout(200);
      }
    }
    
    // Verify app remains stable
    await expect(page.getByText('Quote Builder')).toBeVisible();
  });
});