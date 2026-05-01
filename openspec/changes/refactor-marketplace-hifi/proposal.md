# Proposal: Marketplace High-Fidelity Refinement

## Intent
Enhance the Marketplace UI to achieve a premium, high-density, and feature-rich look. This includes refactoring existing components (Categories, Product Cards) and adding new features (Filters, Carousel, Promotional Badges).

## Scope
- **Categories:** Remove container styling, reduce spacing, highlight selected category in Citronela Green.
- **Product Cards:**
    - Integrated cart button (inside image frame, circular green bubble).
    - Discount display system (OFF percentage, strikethrough original price, discounted price).
    - Social proof ("+X vendidos").
    - "Envío gratis" and "¡ULTIMA!" badges.
- **Navigation:**
    - Horizontal Filter Ribbon (Más vendidos, Ofertas, Envío gratis).
    - Promotional Carousel for banners.
- **Data:** Update mock data to support new features.

## Approach
1. **Types & Data:** Update `Product` interface and `MOCK_PRODUCTS` in `useMarket.ts`.
2. **Category Ribbon:** Simplify `CategoriesRibbon.tsx` to text-only style with green highlights.
3. **Product Card:** Major redesign of `ProductCard.tsx` to accommodate new visual elements and button placement.
4. **New Components:**
    - `FiltersRibbon.tsx`: Simplified horizontal navigation.
    - `MarketCarousel.tsx`: GSAP-powered image slider for banners.
5. **Page Integration:** Update `MarketPage.tsx` to orchestrate the new layout.

## Risks
- **Layout Density:** Adding more data to cards might make them cluttered on small screens.
- **Z-Index:** Button inside image frame needs careful z-index management.
- **Animation Performance:** Carousel and badge animations must stay smooth (GSAP).
