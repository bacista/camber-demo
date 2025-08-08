# Playwright MCP Test Commands for Camber Demo

## How to Run Interactive Tests

These are the exact commands to run with Playwright MCP for comprehensive browser-based testing of the Camber demo application.

### Prerequisites
1. Ensure the application is running on http://localhost:3001
2. Have Playwright MCP installed and connected
3. Use these commands in sequence for best results

---

## Test Commands by Category

### 1. Basic Navigation Tests

#### Test 1.1: Dashboard Loading
```
Use playwright mcp to navigate to http://localhost:3001 and verify the page title contains "Camber"
```

#### Test 1.2: Module Navigation
```
Use playwright mcp to:
1. Navigate to http://localhost:3001
2. Click on "Quotes" in the navigation
3. Verify the URL changes to /quote-b2b
4. Verify the page shows "Quote Builder" heading
```

### 2. Quote Module Tests

#### Test 2.1: Quote List Display
```
Use playwright mcp to:
1. Navigate to http://localhost:3001/quote-b2b
2. Verify that quote cards are displayed with IDs Q-2024-1001, Q-2024-1000
3. Check that status badges show (Draft, Sent, Accepted)
4. Verify the "12" badge appears next to Quotes in the nav
```

#### Test 2.2: Quote Search
```
Use playwright mcp to:
1. Go to http://localhost:3001/quote-b2b
2. Type "ACME" in the Customer search box
3. Verify filtered results appear
4. Clear the search and verify all quotes return
```

#### Test 2.3: File Upload Overlay
```
Use playwright mcp to:
1. Navigate to http://localhost:3001/quote-b2b
2. Click "New Quote (Ctrl+N)" button
3. Verify an overlay or new quote form appears
4. Check that relevant form fields are visible
```

### 3. Order Module Tests

#### Test 3.1: Order Status Filters
```
Use playwright mcp to:
1. Navigate to http://localhost:3001/orders-b2b
2. Look for status filter controls
3. If present, click on a status filter
4. Verify the order list updates accordingly
```

#### Test 3.2: Order Details
```
Use playwright mcp to:
1. Go to http://localhost:3001/orders-b2b
2. Click on the first order card if present
3. Verify order details panel opens or page changes
4. Check that order information is displayed
```

### 4. Form Interaction Tests

#### Test 4.1: Quote Creation Form
```
Use playwright mcp to:
1. Navigate to http://localhost:3001/quote-b2b
2. Click "New Quote (Ctrl+N)"
3. Fill any visible form fields
4. Try to save or submit the quote
5. Verify success message or quote creation
```

#### Test 4.2: Form Validation
```
Use playwright mcp to:
1. Go to quote creation form
2. Try to submit without filling required fields
3. Verify validation errors appear
4. Fill required fields one by one
5. Verify errors clear as fields are filled
```

### 5. Responsive Design Tests

#### Test 5.1: Mobile Navigation
```
Use playwright mcp with device emulation:
1. Set viewport to iPhone 15 (390x844)
2. Navigate to http://localhost:3001
3. Verify hamburger menu icon appears
4. Click hamburger menu
5. Verify mobile sidebar opens with navigation options
```

### 6. Performance Tests

#### Test 6.1: Page Load Time
```
Use playwright mcp to:
1. Navigate to http://localhost:3001
2. Measure page load time
3. Navigate to /quote-b2b and measure load time
4. Navigate to /orders-b2b and measure load time
5. Verify all pages load within 3 seconds
```

### 7. Search and Filter Tests

#### Test 7.1: Quote Filters
```
Use playwright mcp to:
1. Navigate to http://localhost:3001/quote-b2b
2. Use the SKU/PN filter field
3. Use the Customer filter field
4. Use the Status dropdown (All Status, Draft, Sent, Accepted)
5. Verify filters work correctly
```

### 8. Keyboard Shortcuts Test

#### Test 8.1: Keyboard Navigation
```
Use playwright mcp to:
1. Navigate to http://localhost:3001/quote-b2b
2. Press Ctrl+N to create new quote
3. Press Alt+1 to go to Dashboard
4. Press Alt+2 to go to Quotes
5. Press Alt+3 to go to Orders
6. Verify keyboard shortcuts work as expected
```

### 9. Data Display Tests

#### Test 9.1: Quote Information Display
```
Use playwright mcp to:
1. Navigate to http://localhost:3001/quote-b2b
2. Verify customer "ACME Construction" is displayed
3. Check for credit information ($35K available)
4. Verify quote totals are displayed correctly
5. Check for "Tax Exempt" badge if present
```

### 10. UI Toggle Tests

#### Test 10.1: Dense/Standard View Toggle
```
Use playwright mcp to:
1. Navigate to http://localhost:3001/quote-b2b
2. Find the Dense/Standard toggle buttons
3. Click on "Standard" view
4. Verify the layout changes
5. Click back to "Dense" view
6. Verify the layout returns to dense mode
```

---

## Running All Tests

To run all tests systematically, execute each command above in order and document the results. The full test suite should take approximately 15-20 minutes to complete with manual verification.

## Tips for Effective Testing

1. **Take Screenshots**: Use Playwright's screenshot capability for failed tests
2. **Wait for Elements**: Allow time for dynamic content to load
3. **Check Console**: Look for JavaScript errors in the browser console
4. **Network Activity**: Monitor network requests for API calls
5. **Accessibility**: Check for proper ARIA labels and keyboard navigation

## Expected Results

Based on the automated testing performed:
- ✅ Core navigation should work
- ✅ Quote and Order pages should load
- ❌ API endpoints (/api/quotes, /api/orders) will return 404
- ❌ Some navigation links (customers, products, etc.) will return 404
- ✅ UI components should render correctly
- ✅ Performance should be acceptable (fast load times)