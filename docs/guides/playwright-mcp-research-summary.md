# Research Summary: Playwright MCP (Model Context Protocol) Setup with Claude Code

## Executive Summary
- **Playwright MCP** is a Model Context Protocol server that provides browser automation capabilities using Playwright
- Enables LLMs to interact with web pages through structured accessibility snapshots without requiring vision models
- Two main implementations: Microsoft's official `@playwright/mcp` and ExecuteAutomation's enhanced version
- Installation in Claude Code is straightforward: `claude mcp add playwright npx -- @playwright/mcp@latest`
- Supports natural language test automation, making testing accessible to non-technical team members

## Methodology
- **Search queries used**: Multiple targeted searches for official documentation, GitHub repositories, setup guides, and practical examples
- **Domains searched**: GitHub, Microsoft documentation, Medium articles, developer blogs
- **Date range**: January 2025 - August 2025
- **Sources validated**: Cross-referenced information from official repositories, community guides, and issue trackers

## Detailed Findings

### Finding 1: What is Playwright MCP?
**Sources**: Microsoft/playwright-mcp GitHub, ExecuteAutomation documentation (High Confidence)
**Summary**: Playwright MCP is a Model Context Protocol server that bridges AI models with browser automation
**Evidence**: 
- Uses Playwright's accessibility tree instead of pixel-based input
- Provides deterministic tool application without screenshot analysis
- Enables natural language browser control through LLMs
- Fast and lightweight operation with structured data

### Finding 2: Key Capabilities
**Sources**: Official documentation, multiple implementation guides (High Confidence)
**Core Features**:
1. **Browser Automation Tools**:
   - Navigation (`browser_navigate`)
   - Element interactions (click, type, hover)
   - Screenshot and snapshot capture
   - Tab management
   - Network request monitoring
   - Dialog handling
   - JavaScript evaluation

2. **Testing Support**:
   - HTTP Methods: GET, POST, PUT, PATCH, DELETE
   - Plain English test commands
   - API testing capabilities
   - Form interactions and validation

3. **Unique Advantages**:
   - No vision models required
   - Deterministic web interactions
   - Persistent session support with cookies
   - Multi-browser support (Chrome, Firefox, WebKit, Edge)

### Finding 3: Installation Requirements and Prerequisites
**Sources**: GitHub repositories, setup guides (High Confidence)
**Requirements**:
- Node.js 18 or newer
- Compatible MCP client (Claude Code, Claude Desktop, VS Code, Cursor)
- Browser binaries (automatically handled by Playwright)

### Finding 4: Step-by-Step Setup for Claude Code
**Sources**: Simon Willison's guide, GitHub issues, official documentation (High Confidence)

**Primary Installation Method**:
```bash
claude mcp add playwright npx -- @playwright/mcp@latest
```

**Alternative Methods**:
```bash
# ExecuteAutomation version with user scope
claude mcp add playwright -s user -- npx -y @executeautomation/playwright-mcp-server

# Project-specific installation
claude mcp add -s project playwright npx -- @playwright/mcp@latest
```

**Verification Steps**:
1. Run `claude mcp list` to verify installation
2. Use `/mcp` command in Claude to view available tools
3. Test with: "Use playwright mcp to open a browser to example.com"

### Finding 5: Configuration Options
**Sources**: Microsoft documentation, configuration guides (High Confidence)

**Command-line Arguments**:
- `--allowed-origins`: Semicolon-separated list of allowed origins
- `--blocked-origins`: Semicolon-separated list of blocked origins
- `--block-service-workers`: Block service workers
- `--browser`: Browser selection (chrome, firefox, webkit, msedge)
- `--caps`: Additional capabilities (vision, pdf)
- `--cdp-endpoint`: CDP endpoint for connection
- `--device`: Device emulation (e.g., "iPhone 15")
- `--executable-path`: Custom browser executable path
- `--user-data-dir`: Custom profile directory location

**Profile Management**:
- **Persistent Profile** (default): Stores login sessions and cookies
  - Windows: `%USERPROFILE%\AppData\Local\ms-playwright\mcp-{channel}-profile`
  - macOS: `~/Library/Caches/ms-playwright/mcp-{channel}-profile`
  - Linux: `~/.cache/ms-playwright/mcp-{channel}-profile`
- **Isolated Mode**: Fresh profile for each session

### Finding 6: Practical Usage Examples
**Sources**: Community tutorials, developer blogs (High Confidence)

**Basic Navigation**:
```
"Navigate to https://example.com and verify the title contains 'Example'"
```

**Form Interaction**:
```
"Fill the input with id 'username' with 'testuser'
Fill the input with id 'password' with 'password123'
Click the button with text 'Login'"
```

**Test Generation Pattern**:
```
"You are a playwright test generator. Navigate to [URL], explore the main features, 
and generate a Playwright TypeScript test based on your interactions."
```

**API Testing**:
```
"Perform a POST request to /api/users with payload {name: 'test', email: 'test@example.com'} 
and verify the response status is 201"
```

### Finding 7: Best Practices
**Sources**: Multiple implementation guides, community feedback (Medium-High Confidence)

1. **First Usage**: Explicitly say "playwright mcp" initially to ensure correct tool selection
2. **Authentication**: Use visible browser for manual login, cookies persist during session
3. **Test Generation**: Use agent mode for autonomous exploration and test discovery
4. **Session Management**: Clear profile between sessions for clean state when needed
5. **Error Handling**: Check `claude mcp list` if tools aren't appearing
6. **Natural Language**: Write tests in plain English for accessibility

### Finding 8: Troubleshooting Common Issues
**Sources**: GitHub issues, community forums (High Confidence)

**Known Issues**:
1. **MCP Tools Not Exposed**: Some Claude Code versions have bugs preventing tool exposure
   - Solution: Update Claude Code or use alternative installation method
2. **Command Syntax Errors**: Incorrect command formats fail silently
   - Solution: Use exact syntax: `claude mcp add playwright npx -- @playwright/mcp@latest`
3. **Windows Git Bash**: Default terminal may cause issues
   - Solution: Switch to cmd or PowerShell
4. **WSL2 Issues**: Communication problems in WSL environments
   - Solution: Use native Windows installation or specific WSL configurations

## Advanced Features

### YAML-Based Testing Framework
A specialized framework exists for natural language YAML-based testing:
- Dynamic element targeting
- Multi-environment configuration
- Session persistence
- Natural language test definitions

### Agent Mode Exploration
Autonomous testing capabilities:
- Self-guided site exploration
- Automatic test generation
- Edge case discovery
- Issue detection through AI behavior

## Comparison Matrix

| Feature | Microsoft Playwright MCP | ExecuteAutomation MCP | Traditional Playwright |
|---------|-------------------------|----------------------|------------------------|
| Natural Language | Yes | Yes | No |
| Vision Models Required | No | No | No |
| API Testing | Yes | Enhanced | Yes (code required) |
| Installation Complexity | Low | Low | Medium |
| Claude Integration | Native | Native | Manual |
| Test Generation | AI-powered | AI-powered | Manual/Recorder |
| Maintenance | Low | Low | High |

## Recommendations

### For Quick Setup:
Use the official Microsoft version with the simple command:
```bash
claude mcp add playwright npx -- @playwright/mcp@latest
```

### For Enhanced Features:
Consider ExecuteAutomation's version for additional API testing capabilities

### For Team Adoption:
1. Start with natural language tests for non-technical members
2. Gradually introduce more complex scenarios
3. Use persistent profiles for authenticated testing
4. Leverage agent mode for test discovery

## Confidence Levels
- **High Confidence**: Installation commands, basic setup, core capabilities
- **Medium Confidence**: Some advanced features, specific error solutions
- **Low Confidence**: Version-specific bugs may vary, some WSL2 workarounds

## References
1. Microsoft Playwright MCP Repository: https://github.com/microsoft/playwright-mcp
2. ExecuteAutomation MCP Playwright: https://github.com/executeautomation/mcp-playwright
3. Simon Willison's Setup Guide: https://til.simonwillison.net/claude-code/playwright-mcp-claude-code
4. Playwright MCP Documentation: https://executeautomation.github.io/mcp-playwright/docs/intro
5. Community Troubleshooting: https://github.com/anthropics/claude-code/issues
6. Medium Tutorials: Various authors on Playwright MCP implementation (2025)

## Summary
Playwright MCP represents a significant advancement in test automation, making browser testing accessible through natural language while maintaining the power of Playwright's capabilities. The integration with Claude Code is straightforward, and the tool's ability to operate without vision models makes it efficient and deterministic for frontend testing automation.