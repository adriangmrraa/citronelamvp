# Proposal: Market E-Commerce Flow (Redeem Environment)

## Intent
Implement the "Canjear ahora" (Buy Now) flow to allow users to purchase/redeem products directly from the detail page. This addresses the current gap where the market is purely a visual catalog without a functional transaction loop, while maintaining the project's high-fidelity "ciber-industrial" aesthetic.

## Scope

### In Scope
- New dedicated route: `app/(app)/market/checkout/[id]/page.tsx`.
- Checkout Terminal UI: A focused, distraction-free environment for confirming the redeem.
- Transaction Simulation: Authorizing tokens and creating a mock order via `api/orders`.
- Success Feedback: High-impact confirmation state and redirect to "Mis Canjes".
- Wiring: "CANJEAR AHORA" button in `ProductDetailPage` redirects to the new route.

### Out of Scope
- Real payment gateway (strictly simulated Token usage).
- Multi-item checkout flow (deferred to a future "Cart Checkout" update).
- Address management (simulated shipping selection).

## Approach
We will implement a **Focused Checkout Terminal**. When the user clicks "Canjear ahora", they are redirected to a dedicated route that uses a custom layout (minimizing header/footer noise). The UI will present the purchase as a "Secure Transaction" with telemetric data (PH/EC/Tokens balance) and use GSAP for high-impact confirmation transitions.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/(app)/market/[id]/page.tsx` | Modified | Add redirect to checkout on "CANJEAR AHORA" click. |
| `app/(app)/market/checkout/[id]` | New | New route for the focused checkout experience. |
| `components/features/market/` | New | Create `CheckoutTerminal.tsx` and related sub-components. |
| `app/api/orders/` | Modified | Ensure the endpoint handles new redeem requests (mock). |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Inconsistent layout | Med | Use a `checkout` group layout or a focused sub-layout. |
| State loss on refresh | Low | Rely on URL `id` param and local data fetching. |
| Mobile visual density | Low | Follow the established 2-column pattern for mobile. |

## Rollback Plan
Revert changes to `ProductDetailPage.tsx` to restore the non-functional button and delete the `checkout` directory.

## Success Criteria
- [ ] User can click "CANJEAR AHORA" and arrive at the checkout terminal.
- [ ] The checkout page displays correct product info and a "Confirmar" button.
- [ ] Clicking "Confirmar" triggers a simulated authorization and redirects to "Mis Canjes".
- [ ] The UI maintains the 2026 ciber-industrial aesthetic.
