# Camber Demo Platform

Unified demonstration platform for Camber's AI-driven sales automation for industrial/building material suppliers.

## Overview

This platform showcases Camber's quote-to-order workflow, demonstrating how AI transforms a 45-minute manual process into 45 seconds of automation.

## Project Structure

```
camber-demo/
├── frontend/           # Next.js demo application
│   ├── app/           # App router pages and API routes
│   ├── components/    # React components
│   ├── lib/           # Core utilities and mock backend
│   └── hooks/         # React hooks
├── mock-backend/      # Shared mock services
│   ├── data/          # Mock data definitions
│   ├── api/           # API implementations
│   └── generators/    # Test data generators (future)
├── orchestration/     # Demo automation (future)
│   ├── scenarios/     # Pre-defined demo scenarios
│   └── reset/         # Environment reset scripts
└── docs/              # Documentation
```

## Quick Start

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev

# Access the demo
open http://localhost:3000
```

## Key Features

### Current
- **AI-Powered Quote Building**: Drag & drop RFQ with intelligent extraction
- **Quote Lifecycle Management**: Draft → Sent → Accepted → Converted
- **Smart Order Processing**: Automatic conversion with 100% confidence
- **Rich Metadata**: Billing/shipping addresses, tax exemption, discounts

### Planned
- Mobile companion app
- Voice interface integration
- ERP/Email simulators
- Automated demo flows for trade shows

## Demo Flow

1. **Upload RFQ** - AI extracts and populates quote
2. **Review & Enhance** - Add discounts, set addresses
3. **Send Quote** - Track status and version
4. **Accept Quote** - Capture PO number
5. **Auto-Convert** - Watch order appear with full metadata
6. **Process Order** - See automation benefits

## Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Context + Hooks
- **Mock Backend**: TypeScript services matching production APIs

## API Compatibility

The mock backend exactly mirrors production API signatures, enabling seamless migration to real backend services. See [API Compatibility Guide](docs/API_COMPATIBILITY.md) for details.

## Development Roadmap

### Phase 1: Foundation ✅
- Next.js setup with TypeScript
- Mock backend with quote/order APIs
- Basic quote → order flow

### Phase 2: Quote Builder (In Progress)
- File upload with extraction animation
- Complete quote lifecycle
- Advanced pricing controls

### Phase 3: Order Intelligence
- Source badges and filtering
- Quote metadata display
- Confidence visualization

### Phase 4: Polish
- Smooth animations
- Demo timing optimization
- Success celebrations

## Contributing

This is a demonstration platform optimized for video recording and sales demos. When contributing:

1. Maintain API compatibility with production backend
2. Focus on visual impact and smooth transitions
3. Keep demo flow under 3 minutes
4. Document any new mock endpoints

## Future Vision

This platform will evolve to become a comprehensive demo ecosystem including:
- Real-time data generators
- Integration simulators (ERP, EDI, Email)
- Automated trade show demos
- ROI calculators
- Mobile and voice interfaces

## License

Proprietary - Camber