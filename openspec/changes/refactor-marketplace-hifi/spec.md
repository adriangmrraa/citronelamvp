# Specification: Marketplace High-Fidelity Refinement

## 1. Categories Ribbon Refactor
- **Styling:** Remove background color, borders, and shadows from category buttons.
- **Layout:** Reduce gap between categories (e.g., `gap-4` or `gap-6` depending on typography).
- **Active State:** When a category is selected, its text color must be Citronela Green (`#a3e635`). Inactive categories should be zinc-500/zinc-400.
- **Font:** Keep `font-bold` for better presence without containers.

## 2. Product Card Enhancements
### 2.1 Cart Button
- **Placement:** Positioned within the image frame (relative to container).
- **Design:** Circular green bubble (`bg-[#a3e635]`) with the cart icon inside (`text-[#07120b]`).
- **Interaction:** Hover effect should scale the bubble.

### 2.2 Pricing & Discounts
- **Layout:**
    - Line 1: `[Discount Percentage] OFF` | `[Strikethrough Original Price]` (side by side).
    - Line 2: `[Discounted Price]` | `[+X Vendidos]` (side by side, price emphasized).
- **Conditions:** Only apply to 7 random products.
- **Social Proof:** "+X vendidos" where X is a random number.

### 2.3 Badges & Lines
- **Envío gratis:** Add a dedicated line below the pricing info for 5 random products.
- **¡ULTIMA!:** Add a tag inside the image frame, bottom-left corner, for 3 random products.

## 3. New Navigation Elements
### 3.1 Filters Ribbon
- **Location:** Below the Categories Ribbon.
- **Options:** "Más vendidos", "Ofertas", "Envío gratis".
- **Interaction:** Click to filter the grid.

### 3.2 Marketplace Carousel
- **Location:** Between Categories Ribbon and Filters Ribbon.
- **Content:** Promotional banners (Mock images).
- **Functionality:** Horizontal scroll/auto-play with GSAP animations.
