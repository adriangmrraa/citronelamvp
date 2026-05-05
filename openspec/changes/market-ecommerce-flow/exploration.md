## Exploration: Market E-Commerce Flow (Redeem Environment)

### Current State
- The product detail page (`app/(app)/market/[id]/page.tsx`) contains a "CANJEAR AHORA" button that is currently non-functional (no `onClick` handler).
- The "AGREGAR AL CARRITO" button works correctly, interacting with the global `CartContext` and opening a side drawer.
- There is a purchase history page (`app/(app)/market/orders/page.tsx`) that fetches data from a simulated API, but no actual "purchase" (redeem) mechanism is implemented.
- The project follows a "ciber-industrial" aesthetic with heavy use of GSAP, glassmorphism, and CRT-style overlays.

### Affected Areas
- `app/(app)/market/[id]/page.tsx`: Needs to handle the "CANJEAR AHORA" action.
- `app/(app)/market/checkout/page.tsx` (New): To provide a focused environment for purchase confirmation.
- `components/features/market/CheckoutTerminal.tsx` (New): A high-fidelity component for the checkout process, potentially using CRT effects and telemetry-style data.
- `hooks/useMarket.ts`: To ensure single product retrieval is optimized for the checkout page.
- `types/market.ts`: To define any new types related to orders or checkout states.

### Approaches
1. **Checkout Modal Overlay**
   - **Description**: Open a full-screen modal within the product page to confirm the redemption.
   - **Pros**: Fast, keeps user in context, easy to implement.
   - **Cons**: Can feel less "serious" or "premium" than a dedicated flow. Harder to manage state if the user shares the URL or refreshes.
   - Effort: Low

2. **Dedicated Checkout Terminal Page**
   - **Description**: Redirect the user to `/market/checkout/[id]`. This page would have a "focused" layout (no main nav noise) and look like a high-tech transaction terminal.
   - **Pros**: Matches the "premium" and "architectural" goal. Allows for a focused, high-impact UI (e.g., "Initializing Transaction...", "Authorizing Tokens..."). Better URL-based state management.
   - **Cons**: Requires a new route and layout management.
   - Effort: Medium

3. **Cart-Based Redemption**
   - **Description**: Automatically add the item to the cart and open the checkout summary within the existing cart drawer.
   - **Pros**: Reuses existing cart infrastructure.
   - **Cons**: Dilutes the "Buy Now" concept. If the user had other items in the cart, it might be confusing.
   - Effort: Low

### Recommendation
**Approach 2: Dedicated Checkout Terminal Page**. 
Given the user's focus on "WOWing" the visitor and the "ciber-industrial" theme, a dedicated page that feels like a "Secure Terminal" for token exchange is the most atmospheric and premium choice. It allows us to use specific GSAP animations and CRT overlays that might be too heavy for a simple modal.

### Risks
- **Layout Consistency**: We need to ensure the focused layout (without the standard header) still feels like part of the Citronela platform.
- **State Persistence**: If using a new page, we must handle product data fetching gracefully (re-fetching via ID).
- **Mobile Density**: The checkout flow must be extremely clear on mobile, following the 2-column/high-density pattern established in the report.

### Ready for Proposal
Yes. The next step is to create a formal proposal for the "Checkout Terminal" flow.
