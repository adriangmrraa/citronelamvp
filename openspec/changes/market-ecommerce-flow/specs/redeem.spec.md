# Spec: Market Redeem Flow

## Given: A user on the product detail page
## When: They click the "CANJEAR AHORA" button
## Then: They are redirected to `/market/checkout/[id]`

## Given: A user on the checkout page
## When: The page loads
## Then: They see the product name, image, and price in tokens
## And: They see their current (simulated) token balance
## And: They see a "CONFIRMAR CANJE" button

## Given: A user clicks "CONFIRMAR CANJE"
## When: The transaction is "processing"
## Then: A high-fidelity animation (GSAP) shows authorization state
## And: After 2 seconds, the order is created and the user is redirected to `/market/orders`

## Given: A user has insufficient tokens (Simulation)
## When: They try to confirm
## Then: An error message is displayed within the terminal UI
