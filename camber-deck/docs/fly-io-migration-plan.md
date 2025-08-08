# Fly.io Migration Plan for Camber Deck API

## Overview
This document outlines the complete migration plan from Vercel Serverless Functions to Fly.io for the Camber Deck authentication API. The migration addresses issues with module system conflicts, provides a consistent development/production environment, and reduces operational complexity.

## Migration Objectives
- **Consistent Environment**: Same Express server in development and production
- **No Cold Starts**: Always-on server (unlike serverless functions)
- **Simplified Debugging**: Real-time logs and SSH access
- **Cost Effective**: ~$2/month for expected usage
- **Port Management**: Use port 3030 locally to avoid conflicts

---

## Phase 0: Pre-Migration Checklist

### Check Port Availability
```bash
# Check if port 3030 is available
lsof -i :3030

# Alternative check
nc -zv localhost 3030

# If occupied, try ports 3031, 3032, etc.
```

### Current Architecture Assessment
- Frontend: React/Vite app on Vercel (https://camber-deck.vercel.app)
- API: Attempting Vercel Functions (failing due to module conflicts)
- Services: Upstash Redis (sessions), Resend (emails)
- Local Dev: Express server on port 3001

---

## Phase 1: Install Required Tools

### Install Fly CLI
```bash
# macOS with Homebrew
brew install flyctl

# Alternative: Universal install script
curl -L https://fly.io/install.sh | sh

# Verify installation
fly version
```

---

## Phase 2: Local Development Setup

### 2.1 Configure Port Settings

Update `.env.local`:
```env
# API Configuration
API_PORT=3030
VITE_API_URL=http://localhost:3030

# Services
UPSTASH_REDIS_REST_URL=<YOUR_UPSTASH_REDIS_REST_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_UPSTASH_REDIS_REST_TOKEN>
RESEND_API_KEY=<YOUR_RESEND_API_KEY>
RESEND_FROM=onboarding@resend.dev
RESEND_REPLY_TO=onboarding@resend.dev
JWT_SECRET=development-secret-key-change-in-production
REQUIRE_ALLOWLIST=false
```

### 2.2 Update Server Configuration

Modify `server.js`:
```javascript
// Port configuration
const PORT = process.env.API_PORT || process.env.PORT || 3030;

// CORS configuration
const corsOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL 
  : 'http://localhost:5173';

app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

### 2.3 Update Vite Configuration

Modify `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3030',
    changeOrigin: true,
    secure: false
  }
}
```

### 2.4 Update Package Scripts

Modify `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:vite\"",
    "dev:api": "PORT=3030 node server.js",
    "dev:vite": "vite",
    "test:api": "PORT=3030 NODE_ENV=production node server.js"
  }
}
```

---

## Phase 3: Docker Configuration

### 3.1 Create Production Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application code
COPY server.js .
COPY src ./src

# Create non-root user
RUN useradd -r -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Expose port (8080 for Fly.io convention)
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
```

### 3.2 Create .dockerignore

Create `.dockerignore`:
```
node_modules
npm-debug.log
.env*
.git
.gitignore
README.md
.vscode
.DS_Store
dist
build
*.test.js
coverage
.nyc_output
api/
vercel.json
```

### 3.3 Test Docker Locally

```bash
# Build image
docker build -t camber-api .

# Run container (maps container's 8080 to local 3030)
docker run -p 3030:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e FRONTEND_URL=http://localhost:5173 \
  -e UPSTASH_REDIS_REST_URL="<YOUR_UPSTASH_REDIS_REST_URL>" \
  -e UPSTASH_REDIS_REST_TOKEN="<YOUR_UPSTASH_REDIS_REST_TOKEN>" \
  -e RESEND_API_KEY="<YOUR_RESEND_API_KEY>" \
  -e RESEND_FROM="onboarding@resend.dev" \
  -e JWT_SECRET="test-secret" \
  -e REQUIRE_ALLOWLIST="false" \
  camber-api

# Test endpoints
curl http://localhost:3030/health
curl http://localhost:3030/api/auth/request -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Phase 4: Clean Up Vercel Files

### Files to Remove
```bash
# Remove API directory and Vercel configs
rm -rf api/
rm vercel.json
rm test-resend.js

# Commit cleanup
git add -A
git commit -m "chore: remove Vercel serverless functions"
```

---

## Phase 5: Fly.io Configuration

### 5.1 Create fly.toml

Create `fly.toml`:
```toml
app = "camber-deck-api"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  
  [http_service.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20

[checks]
  [checks.health]
    grace_period = "5s"
    interval = "30s"
    method = "GET"
    path = "/health"
    protocol = "http"
    timeout = "3s"
```

---

## Phase 6: Deploy to Fly.io

### 6.1 Initialize Application

```bash
# Login to Fly.io
fly auth login

# Launch without deploying
fly launch --no-deploy

# Interactive prompts:
# - App name: camber-deck-api
# - Organization: personal (or your org)
# - Region: iad (Virginia, US East)
# - No to PostgreSQL
# - No to Redis
# - No to other databases
```

### 6.2 Set Production Secrets

```bash
# Set all secrets at once
fly secrets set \
  UPSTASH_REDIS_REST_URL="<YOUR_UPSTASH_REDIS_REST_URL>" \
  UPSTASH_REDIS_REST_TOKEN="<YOUR_UPSTASH_REDIS_REST_TOKEN>" \
  RESEND_API_KEY="<YOUR_RESEND_API_KEY>" \
  RESEND_FROM="onboarding@resend.dev" \
  RESEND_REPLY_TO="onboarding@resend.dev" \
  JWT_SECRET="$(openssl rand -base64 32)" \
  REQUIRE_ALLOWLIST="false" \
  FRONTEND_URL="https://camber-deck.vercel.app"
```

### 6.3 Deploy Application

```bash
# Deploy
fly deploy

# Monitor deployment
fly logs --tail

# Check status
fly status

# Get app info (includes URL)
fly info
```

Your API will be available at: `https://camber-deck-api.fly.dev`

---

## Phase 7: Update Frontend

### 7.1 Environment Configuration

Create `.env.production`:
```env
VITE_API_URL=https://camber-deck-api.fly.dev
```

Update `.env.local`:
```env
VITE_API_URL=http://localhost:3030
```

### 7.2 Update API Calls

Update all components to use environment variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030';

// Example in LoginForm.tsx
const response = await fetch(`${API_URL}/api/auth/request`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

### 7.3 Deploy Frontend Updates

```bash
git add .
git commit -m "feat: migrate API endpoints to Fly.io"
git push origin main
# Vercel auto-deploys
```

---

## Phase 8: Testing & Verification

### 8.1 Local Testing Checklist
- [ ] Port 3030 is available
- [ ] Express server starts on port 3030
- [ ] Frontend connects to localhost:3030
- [ ] Magic link flow works locally
- [ ] Docker container runs successfully
- [ ] Health check endpoint responds

### 8.2 Production Testing Checklist
- [ ] Fly.io deployment successful
- [ ] Health check at https://camber-deck-api.fly.dev/health
- [ ] Frontend at https://camber-deck.vercel.app loads
- [ ] Login form submits successfully
- [ ] Magic links are sent (check Fly logs)
- [ ] Authentication flow completes

### 8.3 Monitoring Commands

```bash
# View logs
fly logs --tail

# SSH into container
fly ssh console

# Check app status
fly status

# View metrics
fly dashboard

# List secrets (names only)
fly secrets list

# Restart if needed
fly apps restart camber-deck-api
```

---

## Phase 9: Rollback Plan

### If Issues Occur

1. **Immediate Rollback**:
```bash
# List releases
fly releases

# Rollback to previous version
fly deploy --image registry.fly.io/camber-deck-api:deployment-[PREVIOUS_ID]
```

2. **Frontend Rollback**:
- Vercel automatically maintains deployment history
- Use Vercel dashboard to instant rollback

3. **Local Fallback**:
- Continue using local Express server
- Update frontend to use localhost:3030 temporarily

---

## Cost Analysis

### Fly.io Pricing (for your usage)
- **VM**: 1x shared-cpu-1x with 256MB RAM = ~$1.94/month
- **Bandwidth**: <1GB/month = ~$0.02
- **Total**: ~$2/month

### Comparison
- **Fly.io**: ~$2/month, no cold starts
- **Railway**: $5/month, no cold starts
- **Render Free**: $0/month, 30-second cold starts
- **Vercel Functions**: Complex setup, module conflicts

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Port 3030 Unavailable Locally
```bash
# Find process using port
lsof -i :3030
# Kill process if needed
kill -9 [PID]
# Or use alternative port (3031, 3032, etc.)
```

#### Docker Build Fails
```bash
# Clear Docker cache
docker system prune -a
# Rebuild with no cache
docker build --no-cache -t camber-api .
```

#### Fly.io Deploy Fails
```bash
# Check build logs
fly logs --app camber-deck-api

# Validate fly.toml
fly config validate

# Try deploying with more verbose output
fly deploy --verbose
```

#### CORS Issues
```javascript
// Ensure server.js has correct CORS config
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

#### Environment Variables Not Working
```bash
# List current secrets
fly secrets list

# Update a specific secret
fly secrets set JWT_SECRET="new-value"

# Restart app to pick up changes
fly apps restart camber-deck-api
```

---

## Maintenance Tasks

### Regular Updates
```bash
# Update dependencies locally
npm update
npm audit fix

# Test locally
npm run test:api

# Deploy updates
fly deploy
```

### Scaling (if needed)
```bash
# Scale to 2 machines for high availability
fly scale count 2

# Scale back to 1 for cost savings
fly scale count 1

# Adjust machine size if needed
fly scale vm shared-cpu-2x
```

### Backup Secrets
```bash
# Save secret names (values are hidden)
fly secrets list > secrets-backup.txt

# Document in password manager
# Store copies in secure location
```

---

## Success Criteria

The migration is complete when:
1. ✅ Express API runs on Fly.io
2. ✅ Frontend on Vercel connects to Fly.io API
3. ✅ Authentication flow works end-to-end
4. ✅ Local development uses port 3030
5. ✅ No Vercel Functions remain
6. ✅ Monitoring and logs are accessible
7. ✅ Total cost is ~$2/month

---

## References

- [Fly.io Documentation](https://fly.io/docs)
- [Fly.io Node.js Guide](https://fly.io/docs/languages-and-frameworks/node/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Docker Node.js Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-01-08 | 1.0 | Initial migration plan | System |

---

## Notes

- Port 3030 chosen to avoid conflicts with common development ports (3000, 3001, 8080)
- Fly.io's `iad` region selected for proximity to US East Coast
- Using Fly.io's recommended port 8080 internally for production
- Health checks configured for automatic recovery
- Single machine configuration sufficient for <100 users over 6-8 months