# API Compatibility Guide

This document maps mock API endpoints to their production counterparts, ensuring seamless migration from demo to production environment.

## Base URLs

```typescript
// Development (Mock)
const MOCK_API_BASE = 'http://localhost:3000/api/mock'

// Production
const PROD_API_BASE = 'http://localhost:8000/api'
const QUOTE_SERVICE = 'http://localhost:8010/api'
```

## Quote Endpoints

### Create Quote
- **Mock**: `POST /api/mock/quotes`
- **Production**: `POST http://localhost:8000/api/quotes`
- **Request Body**:
```json
{
  "customer_id": "string",
  "sales_rep_id": "string",
  "line_items": [
    {
      "product_id": "string",
      "quantity": "number",
      "unit_price": "number"
    }
  ],
  "billing_address": {},
  "job_site_address": {},
  "project_name": "string",
  "discount": {
    "percentage": "number",
    "reason": "string"
  },
  "tax_exempt": "boolean",
  "tax_exemption_number": "string"
}
```

### List Quotes
- **Mock**: `GET /api/mock/quotes`
- **Production**: `GET http://localhost:8000/api/quotes`
- **Query Parameters**:
  - `status`: Filter by quote status
  - `customer_id`: Filter by customer
  - `sales_rep_id`: Filter by sales rep
  - `limit`: Pagination limit (default: 50)
  - `offset`: Pagination offset

### Get Quote by ID
- **Mock**: `GET /api/mock/quotes/{id}`
- **Production**: `GET http://localhost:8000/api/quotes/{id}`
- **Response**: Complete quote object with status history

### Update Quote
- **Mock**: `PUT /api/mock/quotes/{id}`
- **Production**: `PUT http://localhost:8000/api/quotes/{id}`
- **Note**: Only works for quotes in 'draft' status

### Accept Quote
- **Mock**: `POST /api/mock/quotes/{id}/accept`
- **Production**: `POST http://localhost:8000/api/quotes/{id}/accept`
- **Request Body**:
```json
{
  "po_number": "string",
  "accepted_by": "string",
  "accepted_by_email": "string",
  "acceptance_notes": "string"
}
```
- **Side Effect**: Triggers automatic order creation

### Convert Quote to Order
- **Mock**: `POST /api/mock/quotes/{id}/convert`
- **Production**: `POST http://localhost:8000/api/quotes/{id}/convert`
- **Note**: Only works for quotes in 'accepted' status
- **Response**: Created order object

### Reject Quote
- **Mock**: `POST /api/mock/quotes/{id}/reject`
- **Production**: `POST http://localhost:8000/api/quotes/{id}/reject`
- **Request Body**:
```json
{
  "reason": "string",
  "rejected_by": "string"
}
```

### Generate Quote PDF
- **Mock**: `GET /api/mock/quotes/{id}/pdf`
- **Production**: `GET http://localhost:8000/api/quotes/{id}/pdf`
- **Response**: PDF binary stream

## Order Endpoints

### List Orders
- **Mock**: `GET /api/mock/orders`
- **Production**: `GET http://localhost:8000/api/orders`
- **Query Parameters**:
  - `source`: Filter by source (quote/email/edi/api)
  - `status`: Filter by order status
  - `confidence_min`: Minimum confidence score
  - `limit`: Pagination limit
  - `offset`: Pagination offset

### Get Order by ID
- **Mock**: `GET /api/mock/orders/{id}`
- **Production**: `GET http://localhost:8000/api/orders/{id}`
- **Response**: Complete order with source metadata

### Update Order
- **Mock**: `PUT /api/mock/orders/{id}`
- **Production**: `PUT http://localhost:8000/api/orders/{id}`
- **Use Cases**: Manual review, corrections

### Process Order
- **Mock**: `POST /api/mock/orders/{id}/process`
- **Production**: `POST http://localhost:8000/api/orders/{id}/process`
- **Note**: Sends to ERP system

## OCR/Extraction Endpoints

### Extract from Document
- **Mock**: `POST /api/mock/documents/extract`
- **Production**: `POST http://localhost:8001/api/documents/extract`
- **Request**: Multipart form with file
- **Response**:
```json
{
  "confidence": 0.95,
  "customer": {},
  "line_items": [],
  "addresses": {},
  "extracted_text": "string"
}
```

## WebSocket Events (Future)

### Quote Status Updates
- **Mock**: Simulated via polling or SSE
- **Production**: WebSocket at `ws://localhost:8000/ws/quotes`
- **Events**:
  - `quote.created`
  - `quote.updated`
  - `quote.accepted`
  - `quote.rejected`
  - `quote.converted`

### Order Updates
- **Mock**: Simulated via polling
- **Production**: WebSocket at `ws://localhost:8000/ws/orders`
- **Events**:
  - `order.created`
  - `order.updated`
  - `order.processed`

## Mock-Specific Features

### Demo Control Endpoints (Mock Only)
- `POST /api/mock/demo/reset` - Reset to initial state
- `POST /api/mock/demo/scenario/{name}` - Load predefined scenario
- `GET /api/mock/demo/status` - Get current demo state

### Time Control (Mock Only)
- `POST /api/mock/demo/speed` - Adjust animation speed
- `POST /api/mock/demo/pause` - Pause demo flow
- `POST /api/mock/demo/resume` - Resume demo flow

## Migration Checklist

### Code Changes Required

1. **API Client Configuration**
```typescript
// Before (Demo)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/mock'

// After (Production)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
```

2. **Authentication Headers**
```typescript
// Production requires auth
headers: {
  'Authorization': `Bearer ${token}`,
  'X-Tenant-ID': tenantId
}
```

3. **Error Handling**
```typescript
// Production has different error formats
catch (error) {
  if (error.response?.status === 401) {
    // Handle auth errors
  }
}
```

4. **WebSocket Connection**
```typescript
// Production uses real WebSockets
const ws = new WebSocket('ws://localhost:8000/ws/quotes')
```

## Data Model Differences

### Mock Simplifications
- No authentication/authorization
- Simplified tenant handling
- No rate limiting
- Instant responses (add artificial delays)

### Production Features Not in Mock
- Multi-tenant isolation
- Audit logging
- Webhook notifications
- Background job processing
- File storage (S3)

## Testing Migration

### Step 1: Environment Variable
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 2: Run Backend Services
```bash
cd /Users/bam/dev/backend
docker-compose up
```

### Step 3: Verify Endpoints
```bash
# Test each endpoint
curl http://localhost:8000/api/health
curl http://localhost:8000/api/quotes
```

### Step 4: Update API Client
```typescript
const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  useMock: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
})
```

## Performance Considerations

### Mock Optimizations
- Instant responses for demo flow
- Preloaded data for smooth experience
- No network latency

### Production Considerations
- Add loading states
- Implement retry logic
- Cache responses where appropriate
- Handle network failures gracefully

## Security Notes

### Mock Environment
- No authentication required
- CORS fully open
- All operations permitted

### Production Environment
- JWT authentication required
- CORS restricted to allowed origins
- Role-based access control
- Input validation and sanitization