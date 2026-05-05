# Design: Market Checkout Terminal

## Component Architecture
We will use a focused "Terminal" approach for the checkout.

### Components
1. **`app/(app)/market/checkout/[id]/page.tsx`**
   - Entry point. Fetches product data.
   - Wraps the terminal in a focused layout (no main header/footer).
2. **`components/features/market/CheckoutTerminal.tsx`**
   - Main orchestrator of the checkout UI.
   - Uses GSAP for entry/exit animations.
   - Includes a `Canvas` or `Overlay` for CRT scanline effects.
3. **`components/features/market/CheckoutSummary.tsx`**
   - Displays Product card (compact), Price, and Shipping status.
4. **`components/features/market/TokenStatus.tsx`**
   - Displays User balance vs. Item price.

## Data Flow
- **Input**: `productId` from URL params.
- **State**: `status` ('idle' | 'processing' | 'success' | 'error').
- **Action**: `confirmRedeem()` calls the `/api/orders` endpoint.

## GSAP Orchestration
- **Entry**: Terminal elements slide in with a "digital glitch" effect (`data-gsap="terminal-entry"`).
- **Processing**: A loading bar or telemetric noise while `status === 'processing'`.
- **Success**: A rapid flash and scale-up transition before redirecting.

## Visual Parity
- Background: Keep the "Lava Background" but dimmed (70% opacity) to focus on the terminal.
- Typography: Use **Avigea** for titles and **Inter/Roboto Mono** for telemetric data.
- Color: Primary accent `#A3E635` (Citronela Green).
