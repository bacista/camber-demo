# Camber Demo Implementation Plan

## Executive Summary

Build a unified Next.js application that demonstrates Camber's quote-to-order workflow for a 3-minute Loom demo video. The app will showcase AI-powered extraction, intelligent quote building, and automatic order conversion with 100% confidence scoring.

## Architecture Decision

### Chosen Approach: Unified Demo App
- Single Next.js application with route-based views
- Mock backend matching production API signatures exactly
- Shared state management for seamless demo flow
- Optimized for video recording (not production)

### Why Unified vs Separate Apps
- **Eliminates** cross-app state synchronization complexity
- **Reduces** implementation time by 4-6 hours
- **Enables** smooth transitions for video recording
- **Maintains** visual separation through routing and UI design

## Technical Architecture

```
/camber-demo/
├── frontend/
│   ├── app/
│   │   ├── quote/              # Quote builder view
│   │   ├── orders/             # PO queue view
│   │   └── api/mock/           # Mock API routes
│   ├── components/
│   │   ├── quote/              # Quote-specific components
│   │   ├── orders/             # Order-specific components
│   │   └── shared/             # Shared UI elements
│   ├── lib/
│   │   ├── mock-backend.ts     # Mock data layer
│   │   ├── api-client.ts       # API client (switchable endpoints)
│   │   └── demo-flow.ts        # Demo orchestration
│   └── hooks/
│       ├── useQuoteLifecycle.ts
│       └── useDemoFlow.ts
```

## Implementation Phases

### Phase 1: Foundation (2-3 hours)

#### 1.1 Project Setup
- [x] Create directory structure
- [x] Initialize documentation
- [ ] Set up Next.js with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Install shadcn/ui components

#### 1.2 Mock Backend
- [ ] Create mock data store
- [ ] Implement quote endpoints
  - POST /api/quotes
  - GET /api/quotes
  - GET /api/quotes/{id}
  - PUT /api/quotes/{id}
  - POST /api/quotes/{id}/accept
  - POST /api/quotes/{id}/convert
  - POST /api/quotes/{id}/reject
- [ ] Implement order endpoints
  - GET /api/orders
  - GET /api/orders/{id}
  - PUT /api/orders/{id}
- [ ] Add realistic delays and transitions

#### 1.3 Core Infrastructure
- [ ] Build API client with environment switching
- [ ] Create demo flow state management
- [ ] Implement notification system
- [ ] Set up routing structure

### Phase 2: Quote Builder (3-4 hours)

#### 2.1 File Upload & Extraction
- [ ] Drag-and-drop zone component
- [ ] File type validation
- [ ] Extraction progress animation
- [ ] Mock OCR results with confidence scores

#### 2.2 Quote Management
- [ ] Quote header with status/version/sales rep
- [ ] Customer selector with type badges
- [ ] Line items grid with inventory status
- [ ] Pricing calculations

#### 2.3 Advanced Features
- [ ] Address manager (billing vs job site)
- [ ] Project name field
- [ ] Manual discount controls with reasons
- [ ] Tax exemption toggle
- [ ] Quote actions (save, send, clone)

#### 2.4 Quote Acceptance
- [ ] Acceptance modal with PO capture
- [ ] Status transition animations
- [ ] Conversion trigger logic

### Phase 3: Order Queue (2-3 hours)

#### 3.1 Order List
- [ ] Order cards with source badges
- [ ] Confidence score visualization
- [ ] Filter by source (Quote/Email/EDI)
- [ ] Real-time updates on conversion

#### 3.2 Quote Intelligence
- [ ] Quote metadata panel
- [ ] Original quote comparison
- [ ] Automation benefits display
- [ ] Processing status indicators

#### 3.3 Visual Elements
- [ ] Source badges (Quote/Email/EDI/API)
- [ ] Confidence meters (color-coded)
- [ ] Auto-processing progress
- [ ] Success indicators

### Phase 4: Polish & Demo Flow (2 hours)

#### 4.1 Animations
- [ ] Page transitions (Framer Motion)
- [ ] Status change animations
- [ ] Success celebrations (confetti)
- [ ] Loading states and skeletons

#### 4.2 Demo Optimization
- [ ] Timed sequences for 3-minute video
- [ ] Keyboard shortcuts for control
- [ ] Reset functionality
- [ ] Pre-populated demo data

## Component Specifications

### Quote Components

```typescript
// QuoteHeader.tsx
interface QuoteHeaderProps {
  quoteNumber: string
  version: string
  status: QuoteStatus
  salesRep: string
  createdAt: Date
}

// AddressManager.tsx
interface AddressManagerProps {
  billingAddress: Address
  jobSiteAddress?: Address
  projectName?: string
  onUpdate: (addresses: AddressUpdate) => void
}

// FileUploadZone.tsx
interface FileUploadZoneProps {
  onUpload: (file: File) => void
  extractionProgress?: number
  isExtracting: boolean
}

// QuoteAcceptanceModal.tsx
interface AcceptanceModalProps {
  quote: Quote
  onAccept: (poNumber: string) => void
  onReject: (reason?: string) => void
}
```

### Order Components

```typescript
// SourceBadge.tsx
interface SourceBadgeProps {
  source: 'quote' | 'email' | 'edi' | 'api'
  quoteId?: string
}

// ConfidenceScore.tsx
interface ConfidenceScoreProps {
  score: number // 0-100
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// QuoteMetadataPanel.tsx
interface MetadataPanelProps {
  quoteData: Quote
  orderData: Order
  showComparison?: boolean
}
```

## Mock Backend Design

### Data Models

```typescript
interface Quote {
  id: string
  quote_number: string
  version: number
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted'
  customer: Customer
  sales_rep: SalesRep
  line_items: LineItem[]
  billing_address: Address
  job_site_address?: Address
  project_name?: string
  subtotal: number
  discount?: Discount
  tax_exempt: boolean
  tax_exemption_number?: string
  total: number
  created_at: Date
  updated_at: Date
  status_history: StatusChange[]
}

interface Order {
  id: string
  po_number: string
  source: 'quote' | 'email' | 'edi' | 'api'
  source_metadata?: {
    quote_id?: string
    email_id?: string
    edi_transaction?: string
  }
  confidence_score: number
  customer: Customer
  line_items: OrderLineItem[]
  status: 'pending' | 'processing' | 'approved' | 'rejected'
  created_at: Date
}
```

### State Management

```typescript
class MockBackendService {
  private quotes: Map<string, Quote>
  private orders: Map<string, Order>
  private subscribers: Set<(event: StateEvent) => void>

  async acceptQuote(quoteId: string, poNumber: string) {
    // Update quote status
    // Trigger conversion after delay
    // Notify subscribers
  }

  subscribe(callback: (event: StateEvent) => void) {
    // Real-time updates for demo flow
  }
}
```

## Demo Sequence (3 minutes)

### 0:00 - 0:15: Problem Hook
- Show manual quote chaos
- "15 hours per week wasted"

### 0:15 - 0:35: AI Extraction
- Drag & drop RFQ
- Extraction progress animation
- Confidence scores appear
- Inventory status inline

### 0:35 - 0:55: Smart Quote Building
- Job site vs billing address
- Apply volume discount
- Tax exemption handling
- Margin protection visible

### 0:55 - 1:10: Quote Lifecycle
- Send quote (status change)
- Version number visible
- Sales rep attribution

### 1:10 - 1:30: Magic Moment
- Quote acceptance notification
- PO number capture modal
- Automatic conversion animation
- Status: CONVERTED

### 1:30 - 2:00: Order Intelligence
- Order appears with "From Quote" badge
- 100% confidence score
- Quote metadata displayed
- Auto-processing to ERP

### 2:00 - 2:30: ROI Display
- Time savings visualization
- Error reduction metrics
- Automation benefits
- Audit trail

### 2:30 - 3:00: Call to Action
- "See ROI in Week 1"
- Pilot program CTA
- Calendar link

## Success Metrics

### Technical
- [ ] All mock endpoints match production
- [ ] Smooth animations (<60fps)
- [ ] Demo completes in 3 minutes
- [ ] Zero console errors
- [ ] Mobile responsive

### Business
- [ ] Clear time savings demonstration
- [ ] Enterprise features visible
- [ ] Professional appearance
- [ ] Compelling value proposition

## Risk Mitigation

### Technical Risks
- **Mock API failures**: Implement fallback states
- **Animation performance**: Profile and optimize
- **Browser compatibility**: Test Chrome, Safari, Firefox

### Demo Risks
- **Timing issues**: Add speed controls
- **Data consistency**: Use deterministic seeds
- **Network issues**: Everything runs locally

## Migration to Production

### Code Reusability
- API client: Change base URL only
- Components: 90% production-ready
- Types: Shared with backend
- Styles: Fully reusable

### Required Changes
1. Replace mock backend with real API
2. Add authentication
3. Implement error boundaries
4. Add telemetry/analytics
5. Security hardening

## Next Steps

1. Complete Next.js setup
2. Build mock backend with all endpoints
3. Create quote builder flow
4. Implement order queue
5. Add animations and polish
6. Test complete demo sequence
7. Record Loom video