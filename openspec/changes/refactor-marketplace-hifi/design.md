# Technical Design: Marketplace High-Fidelity Refinement

## 1. Data Layer Enhancements
### Hook: `useMarket.ts`
- Update `Product` interface to include optional fields: `discountPercentage`, `originalPrice`, `soldCount`, `hasFreeShipping`, `isLastUnit`.
- Randomize these fields in `MOCK_PRODUCTS` during initialization or mock generation.
- Add logic to `filteredProducts` to handle the new filter options (Ofertas, Envío gratis, Más vendidos).

## 2. Component Refactoring
### `CategoriesRibbon.tsx`
- Switch from a button-box model to a text-link model.
- Apply `text-primary` for active state and `text-zinc-500` for inactive.

### `ProductCard.tsx`
- **Structure:**
    ```tsx
    <div className="relative overflow-hidden">
      <div className="relative group"> {/* Image Frame */}
        <Image />
        <button className="absolute top-2 right-2 rounded-full bg-primary ..." /> {/* Cart Button */}
        {isLastUnit && <Tag className="absolute bottom-2 left-2 ..." />}
      </div>
      <div className="p-4">
        {/* Pricing Grid */}
        <div className="grid grid-cols-2">
           <div>{discount}% OFF</div>
           <div className="line-through">{originalPrice}</div>
        </div>
        <div>{currentPrice}</div>
        <div>+ {soldCount} vendidos</div>
        {hasFreeShipping && <div>Envío gratis</div>}
      </div>
    </div>
    ```

## 3. New Components
### `FiltersRibbon.tsx`
- Implementation of the secondary filter bar.
- Uses local state to communicate with `useMarket` (likely via a new filter state).

### `MarketCarousel.tsx`
- Uses GSAP for smooth transitions.
- Responsive design: 1 slide on mobile, 2-3 on desktop.

## 4. Integration
### `MarketPage.tsx`
- Reorder components:
  1. `MarketHeader`
  2. `CategoriesRibbon`
  3. `MarketCarousel` (New)
  4. `FiltersRibbon` (New)
  5. `MarketGrid`
