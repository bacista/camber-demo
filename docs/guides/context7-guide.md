# Context7 MCP Complete Usage Guide

## What is Context7 MCP?

Context7 is a Model Context Protocol (MCP) server that provides real-time, accurate documentation directly into Claude's context. It ensures that all generated code uses current APIs, best practices, and up-to-date library documentation.

### Key Benefits
- 🚀 **Real-time Documentation**: Fetches latest docs from official sources
- 📚 **Version-Specific**: Can target specific library versions
- 🎯 **Accuracy**: Eliminates outdated API references
- ⚡ **Efficiency**: No need to manually search documentation
- 🔄 **Dynamic**: Works with any supported library or framework

## How Context7 Works

When you add "use context7" to any prompt, Context7:
1. Identifies the libraries/frameworks mentioned
2. Fetches current documentation from official sources
3. Injects relevant docs into Claude's context
4. Ensures generated code matches current APIs

## Basic Usage

### Simple Syntax
```
"[Your request] use context7"
```

The phrase "use context7" can appear anywhere in your prompt.

### Examples

**Basic Documentation Request:**
```
"How do I use React hooks? use context7"
```

**Code Generation with Current APIs:**
```
"Create a Next.js 14 API route for handling file uploads. use context7"
```

**Best Practices Query:**
```
"What are the current best practices for React state management? use context7"
```

## Practical Examples for Camber Demo

### 1. React Component Development

**Modern Component Patterns:**
```
"Show me the current best way to create a React component with TypeScript. use context7"
```

**Hooks Documentation:**
```
"Explain useEffect cleanup functions with current React 18 examples. use context7"
```

**Performance Optimization:**
```
"How do I optimize React component rendering with useMemo and useCallback? use context7"
```

### 2. Next.js Development

**App Router Patterns:**
```
"Create a Next.js 14 app router layout with metadata. use context7"
```

**Server Components:**
```
"Explain React Server Components in Next.js 14. use context7"
```

**API Routes:**
```
"Create a Next.js API route with proper TypeScript types. use context7"
```

### 3. State Management

**Zustand (Your Current Solution):**
```
"Show me current Zustand patterns for complex state management. use context7"
```

**Context API:**
```
"Create a theme context provider with TypeScript. use context7"
```

**Form State:**
```
"How do I handle form state in React with current best practices? use context7"
```

### 4. Styling and UI

**Tailwind CSS:**
```
"Show me advanced Tailwind CSS techniques for responsive design. use context7"
```

**CSS-in-JS:**
```
"What are the current CSS-in-JS best practices for Next.js? use context7"
```

**Animation:**
```
"How do I create smooth animations with Framer Motion? use context7"
```

### 5. Testing Documentation

**React Testing Library:**
```
"Write tests for a file upload component using React Testing Library. use context7"
```

**Jest Configuration:**
```
"Show me the current Jest configuration for Next.js projects. use context7"
```

**E2E Testing:**
```
"Create Playwright tests following current best practices. use context7"
```

## Advanced Usage Patterns

### 1. Multi-Library Queries

**Combining Technologies:**
```
"Create a Next.js component with Tailwind CSS and Framer Motion animations. use context7"
```

This fetches documentation for all three libraries.

### 2. Migration Guides

**Version Upgrades:**
```
"What are the breaking changes from Next.js 13 to 14? use context7"
```

**Library Updates:**
```
"How do I migrate from React Router v5 to v6? use context7"
```

### 3. Architecture Patterns

**Design Patterns:**
```
"Show me current React design patterns for large applications. use context7"
```

**Project Structure:**
```
"What's the recommended Next.js project structure in 2024? use context7"
```

### 4. Performance Optimization

**Bundle Optimization:**
```
"How do I optimize Next.js bundle size with current techniques? use context7"
```

**Lazy Loading:**
```
"Implement lazy loading in React with Suspense. use context7"
```

## Specific Use Cases for Camber Demo

### Quote Module Enhancement
```
"Add drag-and-drop file upload to React component with current APIs. use context7"
```

### Order Management
```
"Create a sortable, filterable table with React and TypeScript. use context7"
```

### Navigation Component
```
"Implement keyboard navigation in React with accessibility. use context7"
```

### Form Validation
```
"Add form validation using React Hook Form with Zod. use context7"
```

### Real-time Updates
```
"Implement real-time updates with Server-Sent Events in Next.js. use context7"
```

## When to Use Context7

### ✅ Perfect For:
- Writing new components or features
- Updating code to latest APIs
- Learning current best practices
- Resolving deprecation warnings
- Implementing complex patterns
- Migration planning

### ⚠️ Not Needed For:
- Simple syntax questions
- General programming concepts
- Non-library specific code
- Already familiar APIs

## Best Practices

### 1. Be Specific
**Good:**
```
"Create a Next.js 14 server component with data fetching. use context7"
```

**Better:**
```
"Create a Next.js 14 server component that fetches data from an API with error handling and loading states. use context7"
```

### 2. Combine with Actual Coding
**Documentation + Implementation:**
```
"Explain React Server Components then create one for displaying quotes. use context7"
```

### 3. Version-Specific Queries
**When Version Matters:**
```
"Show me Next.js 14 specific features not in version 13. use context7"
```

### 4. Progressive Enhancement
Start simple, then add complexity:
```
1. "Create a basic React component. use context7"
2. "Add TypeScript types to the component. use context7"
3. "Add error boundaries and suspense. use context7"
```

## Common Documentation Queries

### Component Libraries
```
"How do I use Radix UI dropdown menus? use context7"
"Implement Shadcn/ui data tables. use context7"
"Create Material-UI themed components. use context7"
```

### Build Tools
```
"Configure Vite for React projects. use context7"
"Set up Webpack 5 module federation. use context7"
"Optimize Turbopack in Next.js. use context7"
```

### Database/Backend
```
"Use Prisma with Next.js. use context7"
"Implement tRPC in a Next.js app. use context7"
"Set up Supabase authentication. use context7"
```

### Deployment
```
"Deploy Next.js to Vercel with environment variables. use context7"
"Configure Docker for Next.js applications. use context7"
```

## Troubleshooting

### Documentation Not Loading
- Ensure "use context7" is in your prompt
- Check internet connectivity
- Try rephrasing your request

### Outdated Information
- Context7 fetches real-time, but specify versions if needed
- Use "latest" or "current" in your prompt

### Missing Libraries
- Not all libraries are supported
- Fall back to web search for niche libraries

## Context7 vs Other Approaches

### Context7 Advantages
- ✅ Real-time documentation
- ✅ No manual searching
- ✅ Version-specific accuracy
- ✅ Integrated into Claude's context

### When to Use Alternatives
- 🔍 **Web Search**: For blog posts, tutorials, community solutions
- 📖 **Manual Docs**: When you need visual diagrams or interactive examples
- 💬 **Community**: For edge cases and specific issues

## Quick Reference Card

### Essential Commands
```
# Get documentation
"[topic] documentation. use context7"

# Generate code
"Create [component]. use context7"

# Best practices
"Best practices for [topic]. use context7"

# Migration help
"Migrate from [old] to [new]. use context7"

# Debugging
"Fix [error/issue]. use context7"
```

### Power User Tips
1. **Chain Requests**: Ask for explanation then implementation
2. **Iterative Refinement**: Start basic, add features progressively
3. **Comparison Queries**: "Compare X vs Y. use context7"
4. **Architecture Decisions**: "Should I use X or Y for [use case]? use context7"

## Example Workflow for Camber Demo

### Building a New Feature
```
Step 1: "Explain React patterns for data tables. use context7"
Step 2: "Create a sortable quote table component. use context7"
Step 3: "Add pagination to the table. use context7"
Step 4: "Implement keyboard navigation. use context7"
Step 5: "Add export to CSV functionality. use context7"
```

### Refactoring Existing Code
```
Step 1: "Current React performance best practices. use context7"
Step 2: "Identify performance issues in my Quote component"
Step 3: "Optimize the Quote component with modern patterns. use context7"
```

### Learning New Libraries
```
Step 1: "Overview of Tanstack Query. use context7"
Step 2: "Implement Tanstack Query in Next.js. use context7"
Step 3: "Add optimistic updates. use context7"
```

## Summary

Context7 MCP is your real-time documentation companion that ensures:
- 📚 Always current API usage
- 🎯 Accurate code generation
- ⚡ Faster development
- 🔧 Fewer debugging sessions
- 📈 Better code quality

**Remember**: Just add "use context7" to any prompt where you want current, accurate documentation!

## Try It Now

Start with this simple test:
```
"Show me the latest React 18 features. use context7"
```

Then try something specific to your project:
```
"Create a modern file upload component for Next.js with progress tracking. use context7"
```

Happy coding with always-current documentation! 🚀