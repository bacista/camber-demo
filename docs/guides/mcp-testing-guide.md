# MCP Testing Guide for Camber Demo

## ✅ Setup Complete
Both MCP servers are installed and connected:
- **Playwright MCP**: Browser automation and test execution
- **Context7 MCP**: Real-time documentation and best practices

## How to Use Both MCP Tools

### Context7 MCP - For Writing Test Code

Context7 ensures you're using the latest APIs and best practices when writing tests.

#### Usage Pattern
Add "use context7" to any prompt when you need current documentation:

**Example 1: React Component Tests**
```
Write unit tests for the FileUploadOverlay component using React Testing Library. use context7
```

**Example 2: Next.js Route Tests**
```
Create API route tests for the quotes endpoint using Next.js 14 best practices. use context7
```

**Example 3: Playwright Test Generation**
```
Generate Playwright tests for the quote creation workflow following current Playwright best practices. use context7
```

### Playwright MCP - For Running Tests

Playwright MCP executes browser automation and validates UI behavior.

**Example 1: Basic Navigation Test**
```
Use playwright mcp to navigate to http://localhost:3000 and verify the dashboard loads
```

**Example 2: Form Interaction Test**
```
Use playwright mcp to:
1. Go to /quote-b2b
2. Click "New Quote"
3. Fill customer name with "Test Company"
4. Submit the form
5. Verify success message appears
```

## Combined Workflow Examples

### 1. Generate and Run Component Tests

**Step 1: Generate Test with Context7**
```
Write comprehensive tests for the MasterNav component including keyboard shortcuts. use context7
```

**Step 2: Run Tests with Playwright**
```
Use playwright mcp to test the navigation keyboard shortcuts (Alt+1 through Alt+8)
```

### 2. End-to-End Quote Flow Testing

**Step 1: Generate E2E Test Suite with Context7**
```
Create a complete E2E test suite for the quote creation process using Playwright best practices. use context7
```

**Step 2: Execute Tests with Playwright**
```
Use playwright mcp to:
1. Navigate to quotes page
2. Upload a test file
3. Verify line items are extracted
4. Modify quantities
5. Apply discounts
6. Save the quote
7. Verify total calculations
```

### 3. API Testing with Documentation

**Step 1: Generate API Tests with Context7**
```
Write API tests for all quote endpoints using the latest fetch API patterns. use context7
```

**Step 2: Execute API Tests with Playwright**
```
Use playwright mcp to send GET request to /api/quotes and verify response structure
```

## Testing Scenarios for Camber Demo

### Quote Module Tests
```
# Generate test code
Create comprehensive tests for quote file upload and extraction. use context7

# Run the tests
Use playwright mcp to test file upload by dragging a PDF to the upload area
```

### Order Module Tests
```
# Generate test code
Write tests for order status filtering and pagination. use context7

# Run the tests
Use playwright mcp to filter orders by "Processing" status and verify results
```

### Navigation Tests
```
# Generate test code
Create tests for responsive navigation and mobile menu. use context7

# Run the tests
Use playwright mcp with iPhone 15 emulation to test mobile navigation
```

### Customer Intelligence Panel Tests
```
# Generate test code
Write tests for the customer context panel in quote builder. use context7

# Run the tests
Use playwright mcp to verify customer order history loads in the side panel
```

## Best Practices

### 1. Start with Context7 for Code Generation
- Always use Context7 when writing new test code
- Ensures you're using current APIs
- Reduces debugging time

### 2. Use Playwright MCP for Execution
- Run tests immediately after writing
- Validate UI behavior in real browser
- Test across different viewports

### 3. Iterative Testing
```
1. Generate initial test with Context7
2. Run test with Playwright MCP
3. If test fails, regenerate with Context7 using error details
4. Re-run with Playwright MCP
```

### 4. Documentation-Driven Development
```
# Get current React patterns
How should I structure React components in 2024? use context7

# Get testing best practices
What are the current best practices for React Testing Library? use context7
```

## Quick Reference

### Context7 Commands
- `use context7` - Adds current documentation to context
- Works with any library or framework
- No additional configuration needed

### Playwright MCP Commands
- `Use playwright mcp to [action]` - Executes browser automation
- Supports all browsers (Chrome, Firefox, WebKit)
- Maintains session state

## Troubleshooting

### Context7 Issues
- If docs seem outdated, Context7 fetches real-time
- Restart Claude Code if not responding
- Check internet connection for doc fetching

### Playwright Issues
- Ensure app is running (`npm run dev`)
- Check browser permissions
- Verify localhost accessibility

## Advanced Usage

### Performance Testing
```
# Generate performance test
Write performance tests for the quote list rendering. use context7

# Run performance test
Use playwright mcp to measure quote list load time and verify it's under 2 seconds
```

### Accessibility Testing
```
# Generate a11y tests
Create accessibility tests for the quote form following WCAG 2.1. use context7

# Run a11y tests
Use playwright mcp to verify all form inputs have proper labels and ARIA attributes
```

### Cross-Browser Testing
```
# Run same test in different browsers
Use playwright mcp with firefox to test quote creation
Use playwright mcp with webkit to test quote creation
```

## Summary

You now have a powerful testing setup:
- **Context7 MCP**: Ensures accurate, up-to-date test code
- **Playwright MCP**: Executes comprehensive browser tests
- **Combined**: Complete testing solution from code generation to execution

Start by trying this simple test:
```
1. Generate: "Write a test for the dashboard page. use context7"
2. Execute: "Use playwright mcp to navigate to http://localhost:3000 and verify 'Camber' appears"
```

Happy testing! 🚀