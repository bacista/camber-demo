# Playwright MCP Test Examples for Camber Demo

## How to Use Playwright MCP

### Starting a Test Session
Always begin with "use playwright mcp" to activate the browser automation tools.

## Test Examples for Camber Demo

### 1. Basic Navigation Tests

#### Test Dashboard Loading
```
Use playwright mcp to navigate to http://localhost:3000 and verify the page title contains "Camber"
```

#### Test Module Navigation
```
Use playwright mcp to:
1. Navigate to http://localhost:3000
2. Click on "Quotes" in the navigation
3. Verify the URL changes to /quote-b2b
4. Verify the page shows "AI-Powered B2B Quote Builder"
```

### 2. Quote Module Tests

#### Test Quote List Display
```
Use playwright mcp to:
1. Navigate to http://localhost:3000/quote-b2b
2. Verify that quote cards are displayed
3. Check that the "Recent Activity" section is visible
4. Verify the "12" badge appears next to Quotes in the nav
```

#### Test Quote Search
```
Use playwright mcp to:
1. Go to the quotes page
2. Type "Enterprise" in the search box
3. Verify filtered results appear
4. Clear the search and verify all quotes return
```

#### Test File Upload Overlay
```
Use playwright mcp to:
1. Navigate to quotes page
2. Click "New Quote" button
3. Verify the file upload overlay appears
4. Check that drag-and-drop area is visible
5. Verify "Select Files" button is clickable
```

### 3. Order Module Tests

#### Test Order Status Filters
```
Use playwright mcp to:
1. Navigate to http://localhost:3000/orders-b2b
2. Click on "Processing" status filter
3. Verify only processing orders are shown
4. Click "All" to reset the filter
```

#### Test Order Details
```
Use playwright mcp to:
1. Go to orders page
2. Click on the first order card
3. Verify order details panel opens
4. Check that customer information is displayed
```

### 4. Form Interaction Tests

#### Test Quote Creation Form
```
Use playwright mcp to:
1. Navigate to new quote page
2. Fill "Customer Name" with "Test Company"
3. Fill "Email" with "test@example.com"
4. Select "Enterprise" from product dropdown
5. Click "Generate Quote"
6. Verify success message appears
```

#### Test Form Validation
```
Use playwright mcp to:
1. Go to new quote form
2. Click submit without filling fields
3. Verify validation errors appear
4. Fill required fields one by one
5. Verify errors clear as fields are filled
```

### 5. API Testing Examples

#### Test Quote API
```
Use playwright mcp to send GET request to http://localhost:3000/api/quotes and verify:
1. Status code is 200
2. Response contains array of quotes
3. Each quote has required fields (id, customer, status)
```

#### Test Order API
```
Use playwright mcp to:
1. Send GET request to /api/orders
2. Verify response status is 200
3. Check that response includes order data
4. Verify each order has status field
```

### 6. Responsive Design Tests

#### Test Mobile Navigation
```
Use playwright mcp with device emulation:
1. Set viewport to iPhone 15
2. Navigate to http://localhost:3000
3. Verify hamburger menu appears
4. Click hamburger menu
5. Verify mobile sidebar opens
```

### 7. Performance Tests

#### Test Page Load Time
```
Use playwright mcp to:
1. Navigate to dashboard
2. Measure time to first contentful paint
3. Verify page loads within 3 seconds
4. Check that no console errors appear
```

### 8. Authentication Flow Tests

#### Test Login Process
```
Use playwright mcp to:
1. Navigate to login page
2. Fill username "sarah.chen@camber.com"
3. Fill password "demo123"
4. Click "Sign In"
5. Verify redirect to dashboard
6. Check user name appears in sidebar
```

### 9. Search and Filter Tests

#### Test Global Search
```
Use playwright mcp to:
1. Click search icon in header
2. Type "urgent" in search field
3. Verify results from multiple modules appear
4. Click on a result
5. Verify navigation to correct page
```

### 10. Data Validation Tests

#### Test Quote Calculations
```
Use playwright mcp to:
1. Create new quote
2. Add line items with quantities
3. Verify subtotal calculates correctly
4. Apply discount
5. Verify total updates accurately
```

## Advanced Testing Patterns

### Running Multiple Tests in Sequence
```
Use playwright mcp to run this test suite:
1. Start at dashboard
2. Navigate through each main module
3. Verify each page loads without errors
4. Check that navigation highlights update correctly
5. Return to dashboard
```

### Testing Error States
```
Use playwright mcp to:
1. Disconnect network (simulate offline)
2. Try to load quotes
3. Verify error message appears
4. Reconnect and verify recovery
```

## Tips for Effective Testing

1. **Be Specific**: Use exact button text and element descriptions
2. **Wait for Elements**: Include "wait for" when elements load dynamically
3. **Verify Multiple Things**: Chain verifications in a single test
4. **Use Descriptive Text**: Reference visible text rather than CSS selectors
5. **Test Happy and Sad Paths**: Include both success and failure scenarios

## Troubleshooting

### If Browser Doesn't Open
- Ensure your app is running (`npm run dev` in frontend folder)
- Check that Playwright MCP is connected (`claude mcp list`)
- Try restarting Claude Code

### If Elements Can't Be Found
- Verify the exact text or label
- Check if element requires scrolling
- Wait for dynamic content to load
- Use more specific descriptions

## Running Your First Test

To get started, make sure your Camber demo is running:
```bash
cd frontend
npm run dev
```

Then try this simple test:
```
Use playwright mcp to navigate to http://localhost:3000 and take a screenshot
```

This will confirm everything is working correctly!