# Vercel API Deployment Debugging

## Problem Summary
API endpoints were returning 500 errors (FUNCTION_INVOCATION_FAILED) when deployed to Vercel, while working perfectly in local development with Express server.

## Root Cause
The issue was caused by a module system conflict:
1. The project has `"type": "module"` in package.json for Vite compatibility
2. Vercel Functions expect CommonJS format by default
3. TypeScript files in `/api` directory were not being compiled correctly
4. Import statements for local modules were failing in the Vercel runtime

## Debugging Steps

### 1. Initial Investigation
- Tested API endpoints: returning 500 errors
- Checked environment variables: properly set in Vercel dashboard
- Created test endpoints: all failing with same error

### 2. Identified Module System Conflict
- Error logs showed "exports is not defined" 
- This indicates CommonJS/ESM mismatch
- Vite requires ES modules but Vercel Functions work better with CommonJS

### 3. Solution Implementation

#### Step 1: Create CommonJS JavaScript Endpoints
Created `/api/hello.js` using CommonJS format:
```javascript
module.exports = (req, res) => {
  // Handler code
};
```

#### Step 2: Add TypeScript Configuration for API
Created `/api/tsconfig.json` with CommonJS output:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020"
  }
}
```

#### Step 3: Update vercel.json
Simplified configuration to support both JS and TS files:
```json
{
  "functions": {
    "api/**/*.js": { "maxDuration": 10 },
    "api/**/*.ts": { "maxDuration": 10 }
  }
}
```

#### Step 4: Convert Auth Endpoints to CommonJS
Created `/api/auth/request.js` using CommonJS format with dynamic imports for ES modules:
```javascript
const { Resend } = await import('resend'); // Dynamic import for ES module
```

## Final Solution

### File Structure
```
camber-deck/
├── api/
│   ├── hello.js           # Test endpoint (CommonJS)
│   ├── auth/
│   │   ├── request.js     # Auth endpoint (CommonJS)
│   │   └── ...
│   └── tsconfig.json      # TypeScript config for API
├── src/                   # Frontend (ES modules)
├── package.json          # Has "type": "module"
└── vercel.json          # Vercel configuration
```

### Key Changes
1. **Use CommonJS for API routes** - `module.exports` instead of `export default`
2. **Dynamic imports for ES modules** - Use `await import()` for packages like Resend
3. **Separate TypeScript config** - API uses CommonJS, frontend uses ES modules
4. **Simplified vercel.json** - Remove unnecessary rewrites and runtime specifications

## Environment Variables Required
```
RESEND_API_KEY=your_api_key
RESEND_FROM=onboarding@resend.dev
RESEND_REPLY_TO=onboarding@resend.dev
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
JWT_SECRET=your_secret
REQUIRE_ALLOWLIST=false
```

## Testing

### Local Development
```bash
npm run dev  # Runs both Vite and Express server
```

### Vercel Deployment
1. Push changes to GitHub
2. Vercel auto-deploys
3. Test endpoints:
   - `/api/hello` - Basic test endpoint
   - `/api/auth/request` - Authentication endpoint

## Troubleshooting

### If API endpoints still fail:
1. Check Vercel Function logs in dashboard
2. Ensure environment variables are set
3. Verify file uses CommonJS format
4. Check for import/require issues

### Common Issues:
- **"exports is not defined"** - File is using ES modules instead of CommonJS
- **"Cannot find module"** - Path resolution issue or missing dependency
- **500 errors** - Check Function logs for specific error message

## Future Improvements
1. Consider using a build step to compile TypeScript to CommonJS
2. Implement proper session storage with Upstash Redis
3. Add rate limiting and security measures
4. Set up monitoring and error tracking