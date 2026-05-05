# Tasks: Market E-Commerce Flow

## Task Breakdown

- [x] 1.1 Establish `app/(app)/market/checkout/[id]/page.tsx` with a basic layout.
- [x] 1.2 Update `app/(app)/market/[id]/page.tsx` to link "CANJEAR AHORA" to the checkout page.
- [x] 1.3 Verify navigation and path parameter extraction.
- [x] 2.1 Implement `components/features/market/CheckoutTerminal.tsx` structure with CRT scanlines.
- [x] 2.2 Create `components/features/market/CheckoutSummary.tsx` showing product info.
- [x] 2.3 Create `components/features/market/TokenStatus.tsx` to display user balance.
- [x] 3.1 Implement the transaction state machine (idle -> processing -> success).
- [x] 3.2 Wire the "CONFIRMAR" button to trigger the processing state and simulate an API call.
- [x] 3.3 Add GSAP animations for the processing state (loading bars, telemetric noise).
- [x] 4.1 Connect the checkout confirm action to the `/api/orders` endpoint.
- [x] 4.2 Verify the order is created in the database (via API check or UI redirection).
- [x] 4.3 Polish transitions and ensure high-fidelity visual parity.
