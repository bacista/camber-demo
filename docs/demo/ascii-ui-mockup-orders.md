⏺ ASCII UI Mockups: Order Entry States

  Let me visualize the different states of the optimized order entry UI:

  State 1: Dashboard - Morning Overview (Default View)

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Orders                                          Sarah Chen • Tuesday 9:15 AM │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                               │
  │  ┌─────────────────────────────────────────────────────────────────────┐    │
  │  │  🟢 Auto-Processing Pipeline                           [Minimize ▼]  │    │
  │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │    │
  │  │  45 orders • $124,500 • 0 errors • Avg confidence: 94%             │    │
  │  │                                                                     │    │
  │  │  [✓] PO-2024-8901  ACME Construction    $12,500  NET-60  2s ago    │    │
  │  │  [✓] PO-2024-8902  BuildCo Inc          $8,750   NET-30  5s ago    │    │
  │  │  [✓] PO-2024-8903  Regional Builders    $5,200   NET-45  8s ago    │    │
  │  │  [...39 more processing in background]                             │    │
  │  └─────────────────────────────────────────────────────────────────────┘    │
  │                                                                               │
  │  ┌─────────────────────────────────────────────────────────────────────┐    │
  │  │  ⚡ Attention Required (2)                              [Keyboard: A]│    │
  │  ├─────────────────────────────────────────────────────────────────────┤    │
  │  │                                                                     │    │
  │  │  ┌───────────────────────────────────────────────────────────┐     │    │
  │  │  │ Steel Supply Co • PO-2024-8904 • 87% confidence          │     │    │
  │  │  │                                                           │     │    │
  │  │  │ $18,500  [NET-30] [Credit: OK ✓] [Stock: Partial ⚠]     │     │    │
  │  │  │                                                           │     │    │
  │  │  │ ⚠ Line 3: Rebar 1/2" - Need 200, Have 150              │     │    │
  │  │  │   Suggested: Ship 150 now, 50 tomorrow from North Branch│     │    │
  │  │  │                                                           │     │    │
  │  │  │ [APPROVE SPLIT SHIPMENT]  [View Details]  [Find Alt]    │     │    │
  │  │  └───────────────────────────────────────────────────────────┘     │    │
  │  │                                                                     │    │
  │  │  ┌───────────────────────────────────────────────────────────┐     │    │
  │  │  │ New Customer • PO-2024-8905 • 72% confidence            │     │    │
  │  │  │                                                           │     │    │
  │  │  │ $32,000  [TERMS: TBD] [Credit: Check Required] [Stock: ✓]│     │    │
  │  │  │                                                           │     │    │
  │  │  │ ⚠ First order from customer - Needs payment terms        │     │    │
  │  │  │   Suggested: NET-30 (standard for new customers)        │     │    │
  │  │  │                                                           │     │    │
  │  │  │ [APPROVE NET-30]  [APPROVE COD]  [Request Prepay]        │     │    │
  │  │  └───────────────────────────────────────────────────────────┘     │    │
  │  └─────────────────────────────────────────────────────────────────────┘    │
  │                                                                               │
  │  ┌─────────────────────────────────────────────────────────────────────┐    │
  │  │  📊 Live Metrics                                                    │    │
  │  │  Automation Rate: 95.6% ↑ • Avg Process Time: 2.1s • Queue: Empty  │    │
  │  └─────────────────────────────────────────────────────────────────────┘    │
  └─────────────────────────────────────────────────────────────────────────────┘

  State 2: Quick Decision Card - Expanded View

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Quick Review: PO-2024-8904                                    [ESC to close] │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                               │
  │  ┌─── Customer ────────────────────┬─── Order Summary ──────────────────┐   │
  │  │ Steel Supply Co                 │ PO-2024-8904                       │   │
  │  │ ⭐ Trusted Customer (5 years)   │ Source: Email w/PDF                │   │
  │  │ 📊 YTD: $1.2M                   │ Confidence: 87%                    │   │
  │  │ 💳 Avg Pay: 22 days             │ Items: 5                           │   │
  │  └─────────────────────────────────┴────────────────────────────────────┘   │
  │                                                                               │
  │  ┌─── Payment & Credit ─────────────────────────────────────────────────┐   │
  │  │ Terms: NET-30 ✓                  Available Credit: $45,000           │   │
  │  │ Current Balance: $12,500         After This Order: $31,000           │   │
  │  │ [████████░░░░░░░░░░░░] 69% credit utilized - APPROVED               │   │
  │  └───────────────────────────────────────────────────────────────────────┘   │
  │                                                                               │
  │  ┌─── Line Items & Inventory ───────────────────────────────────────────┐   │
  │  │ SKU         Description          Qty    Stock         Status         │   │
  │  │ ─────────────────────────────────────────────────────────────────── │   │
  │  │ RB500-20   1/2" Rebar Grade 60  100    ✓ 450 avail   Ready          │   │
  │  │ RB625-20   5/8" Rebar Grade 60  150    ✓ 300 avail   Ready          │   │
  │  │ CONC-5000  5000 PSI Concrete    50     ⚠ 30 avail    PARTIAL        │   │
  │  │            └─ 🚚 20 more tomorrow at North Branch                   │   │
  │  │ LUM-2X4-8  2x4 Lumber 8ft       200    ✓ 500 avail   Ready          │   │
  │  │ PLY-CDX    1/2" CDX Plywood     75     ✓ 150 avail   Ready          │   │
  │  └───────────────────────────────────────────────────────────────────────┘   │
  │                                                                               │
  │  ┌─── Smart Resolution ──────────────────────────────────────────────────┐   │
  │  │ 🤖 AI Recommendation: APPROVE WITH SPLIT SHIPMENT                    │   │
  │  │                                                                       │   │
  │  │ Ship today:  4 items complete + 30 units concrete    ($14,500)      │   │
  │  │ Ship tomorrow: 20 units concrete from North Branch    ($4,000)       │   │
  │  │                                                                       │   │
  │  │ This matches customer's typical pattern. Similar orders had 100%    │   │
  │  │ satisfaction with split shipments.                                   │   │
  │  └───────────────────────────────────────────────────────────────────────┘   │
  │                                                                               │
  │  ┌───────────────────────────────────────────────────────────────────────┐   │
  │  │ [🟢 APPROVE SPLIT (Enter)]  [🟡 HOLD FOR FULL]  [🔴 REJECT]  [💬 NOTE]│   │
  │  └───────────────────────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────────────────────┘

  State 3: Auto-Processing Only (Minimal UI)

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Orders                                                     ⚡ Auto Mode: ON  │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                               │
  │                      All orders processing automatically                      │
  │                                                                               │
  │                              ┌─────────────┐                                 │
  │                              │  ✓ 0 QUEUE  │                                 │
  │                              └─────────────┘                                 │
  │                                                                               │
  │                          Nothing requires attention                           │
  │                                                                               │
  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
  │                                                                               │
  │  Today's Performance            │  Live Feed (minimized)                     │
  │  ─────────────────────         │  ──────────────────────                    │
  │  Orders: 127                    │  [↓] 10:23 PO-8921 processed $5,200       │
  │  Value: $385,000                │  [↓] 10:23 PO-8922 processed $3,100       │
  │  Auto Rate: 98.4%               │  [↓] 10:22 PO-8923 processed $8,500       │
  │  Avg Time: 1.8s                 │  [↓] 10:22 PO-8924 processed $2,200       │
  │  Exceptions: 2                  │                                            │
  │                                 │  [Show Details]                            │
  │                                                                               │
  └─────────────────────────────────────────────────────────────────────────────┘

  State 4: Exception Handling View

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Exception Handler                                   1 issue needs attention  │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                               │
  │  ┌───────────────────────────────────────────────────────────────────────┐  │
  │  │ 🔴 CREDIT LIMIT EXCEPTION                           PO-2024-8925      │  │
  │  ├───────────────────────────────────────────────────────────────────────┤  │
  │  │                                                                       │  │
  │  │ Customer: BuildCo Inc                    Order Total: $67,500        │  │
  │  │ Current Balance: $45,000                 Credit Limit: $100,000      │  │
  │  │                                                                       │  │
  │  │ ⚠ This order would exceed credit limit by $12,500                    │  │
  │  │                                                                       │  │
  │  │ ┌─── Quick Context ─────────────────────────────────────────────┐    │  │
  │  │ │ • Customer for 3 years, excellent payment history              │    │  │
  │  │ │ • Average days to pay: 18 (terms: NET-30)                     │    │  │
  │  │ │ • Last limit increase: 6 months ago (+$25,000)                │    │  │
  │  │ │ • Similar situation 2 months ago: Approved, paid on time      │    │  │
  │  │ └──────────────────────────────────────────────────────────────┘    │  │
  │  │                                                                       │  │
  │  │ ┌─── Resolution Options ────────────────────────────────────────┐    │  │
  │  │ │                                                                │    │  │
  │  │ │  [1] REQUEST CREDIT INCREASE                                  │    │  │
  │  │ │      Auto-generate request for $125,000 limit                │    │  │
  │  │ │      Typical approval time: 2-4 hours                        │    │  │
  │  │ │      [REQUEST INCREASE]                                       │    │  │
  │  │ │                                                                │    │  │
  │  │ │  [2] SPLIT ORDER                                             │    │  │
  │  │ │      Ship $55,000 now (within limit)                         │    │  │
  │  │ │      Hold $12,500 pending payment                            │    │  │
  │  │ │      [APPROVE PARTIAL]                                        │    │  │
  │  │ │                                                                │    │  │
  │  │ │  [3] REQUEST PREPAYMENT                                       │    │  │
  │  │ │      Send payment request for $12,500                        │    │  │
  │  │ │      Process full order upon receipt                         │    │  │
  │  │ │      [SEND PAYMENT REQUEST]                                   │    │  │
  │  │ │                                                                │    │  │
  │  │ │  [4] OVERRIDE WITH APPROVAL                                  │    │  │
  │  │ │      Manager approval required                               │    │  │
  │  │ │      [REQUEST MANAGER APPROVAL]                              │    │  │
  │  │ └──────────────────────────────────────────────────────────────┘    │  │
  │  └───────────────────────────────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────────────────────────────┘

  State 5: Mobile View (Responsive)

  ┌─────────────────────────┐
  │ 📱 Orders      Sarah C. │
  ├─────────────────────────┤
  │ ⚡ Auto: 45  Queue: 2   │
  ├─────────────────────────┤
  │                         │
  │ ┌─────────────────────┐ │
  │ │ ACME Construction   │ │
  │ │ $18,500 • NET-30    │ │
  │ │ ⚠ Stock: Partial    │ │
  │ │                     │ │
  │ │ [APPROVE] [DETAILS] │ │
  │ └─────────────────────┘ │
  │                         │
  │ ┌─────────────────────┐ │
  │ │ New Customer        │ │
  │ │ $32,000 • SET TERMS │ │
  │ │ ✓ Stock: Available  │ │
  │ │                     │ │
  │ │ [NET-30] [COD]      │ │
  │ └─────────────────────┘ │
  │                         │
  │ ┌─────────────────────┐ │
  │ │ 🟢 Live Feed        │ │
  │ │ 127 orders today    │ │
  │ │ 98.4% automated     │ │
  │ │ [Show Details ▼]    │ │
  │ └─────────────────────┘ │
  └─────────────────────────┘

  State 6: Bulk Operations View

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Bulk Operations Mode                               12 orders selected        │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                               │
  │  ┌─── Selection Summary ─────────────────────────────────────────────────┐   │
  │  │ Total Value: $156,700    Customers: 8    Avg Confidence: 89%         │   │
  │  │ All Credit: ✓ PASS        Inventory: ⚠ 3 partial    Terms: ✓ Set     │   │
  │  └───────────────────────────────────────────────────────────────────────┘   │
  │                                                                               │
  │  ┌─── Quick Filters ─────────────────────────────────────────────────────┐   │
  │  │ [All 12] [Ready (9)] [Need Review (3)] [High Value (4)] [Rush (2)]   │   │
  │  └───────────────────────────────────────────────────────────────────────┘   │
  │                                                                               │
  │  ┌─── Selected Orders ───────────────────────────────────────────────────┐   │
  │  │ [✓] PO-8910  ACME         $12,500  NET-60  ✓ Ready                   │   │
  │  │ [✓] PO-8911  BuildCo      $8,750   NET-30  ✓ Ready                   │   │
  │  │ [✓] PO-8912  Steel Co     $18,500  NET-30  ⚠ Partial Stock           │   │
  │  │ [✓] PO-8913  Regional     $5,200   NET-45  ✓ Ready                   │   │
  │  │ [...8 more selected]                                                  │   │
  │  └───────────────────────────────────────────────────────────────────────┘   │
  │                                                                               │
  │  ┌─── Bulk Actions ──────────────────────────────────────────────────────┐   │
  │  │                                                                       │   │
  │  │  [APPROVE ALL READY (9)]  Primary action for orders without issues   │   │
  │  │                                                                       │   │
  │  │  [REVIEW ISSUES (3)]      Open each order with issues                │   │
  │  │                                                                       │   │
  │  │  [EXPORT SELECTED]  [ASSIGN TO USER]  [ADD TAG]  [CHANGE PRIORITY]   │   │
  │  └───────────────────────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────────────────────┘

  State 7: AI Learning Mode (Feedback Loop)

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ AI Learning from Your Decision                                               │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                               │
  │  You approved a split shipment for Steel Supply Co                          │
  │                                                                               │
  │  ┌───────────────────────────────────────────────────────────────────────┐  │
  │  │ 🤖 Should I apply this pattern in the future?                        │  │
  │  │                                                                       │  │
  │  │ When Steel Supply Co orders partial stock items:                     │  │
  │  │ □ Always split ship if >75% available                                │  │
  │  │ □ Only split ship for orders under $25,000                           │  │
  │  │ □ Ask me each time                                                   │  │
  │  │                                                                       │  │
  │  │ [Save Preference]  [One-time Only]                                   │  │
  │  └───────────────────────────────────────────────────────────────────────┘  │
  │                                                                               │
  │  Based on this pattern, I can auto-process 12 more orders/month             │
  └─────────────────────────────────────────────────────────────────────────────┘

  Key Design Principles Illustrated 🎨

  1. Progressive Disclosure: Normal state shows minimal UI, expands only when needed
  2. Ambient Information: Key metrics always visible without clicking
  3. One-Click Actions: Every decision point has a default action ready
  4. Smart Grouping: Similar issues batched together
  5. Contextual Intelligence: AI suggestions based on specific situation
  6. Mobile-First: Critical actions possible on small screens
  7. Learning Loop: System gets smarter with each decision

  The goal: Most of the time, users see State 3 (empty queue) because everything is auto-processing. When
  they do need to act, it's State 1 or 2 with one-click resolutions.
