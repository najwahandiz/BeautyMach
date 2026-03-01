# Filters Logic — Line-by-Line Explanation

This document explains how the product filters work in the Beauty Match Catalogue, including search, category, skin type filters, and sorting.

---

## 1. Overview

The filter system is split across several files:

| File | Role |
|------|------|
| `Catalogue.jsx` | Holds filter state, runs `filterAndSortProducts`, wires UI |
| `FiltersSidebar.jsx` | Category and Skin Type checkbox filters |
| `SearchBar.jsx` | Text search input |
| `SortSelect.jsx` | Sort order dropdown |
| `ProductGrid.jsx` | Displays filtered products (or empty/loading state) |

---

## 2. Filter Object Structure

```javascript
const initialFilters = { search: '', sort: 'default', categories: [], skinTypes: [] };
```

| Property | Type | Description |
|----------|------|-------------|
| `search` | `string` | Text query for product name |
| `sort` | `string` | One of `'default'`, `'price-low'`, `'price-high'` |
| `categories` | `string[]` | Selected subcategories (e.g. `['cleanser', 'serum']`) |
| `skinTypes` | `string[]` | Selected skin types (e.g. `['dry', 'sensitive']`) |

---

## 3. Catalogue.jsx — Line-by-Line

### Imports (Lines 1–9)

```javascript
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsThunks';
// ...icons and components
```

- `useState`: local filter state
- `useEffect`: fetch products if needed
- `useMemo`: memoized filtered/sorted list
- `useSelector` / `useDispatch`: Redux for products and loading/error

---

### filterAndSortProducts (Lines 11–31)

```javascript
function filterAndSortProducts(products, filters) {
```

Runs all filtering and sorting in one place. Takes raw products and a filter object, returns a new sorted array.

---

```javascript
  if (!products?.length) return [];
```

- If products are missing or empty, return an empty array.
- Uses optional chaining (`?.`) to avoid errors when `products` is null/undefined.

---

```javascript
  let list = [...products];
```

- Copy products so the original array is not mutated.

---

```javascript
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((p) => (p.name || '').toLowerCase().includes(q));
  }
```

- If there is a search term:
  - `q`: lowercase search string
  - `p.name || ''`: use empty string if name is missing
  - Keep only products whose name (lowercase) contains `q`.

---

```javascript
  if (filters.categories.length > 0) {
    list = list.filter((p) =>
      filters.categories.some((cat) => (p.subcategory || '').toLowerCase().includes(cat.toLowerCase()))
    );
  }
```

- If any categories are selected:
  - A product passes if at least one selected category matches.
  - Uses `subcategory` (or `''` if absent).
  - `includes` does a substring match (e.g. `"cleanser"` matches `"Gentle Cleanser"`).

---

```javascript
  if (filters.skinTypes.length > 0) {
    list = list.filter((p) =>
      filters.skinTypes.some((t) => (p.skinType || '').toLowerCase().includes(t.toLowerCase()))
    );
  }
```

- Same logic as categories, but uses `skinType`.
- Product passes if it matches any selected skin type.

---

```javascript
  if (filters.sort === 'price-low') list.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (filters.sort === 'price-high') list.sort((a, b) => (b.price || 0) - (a.price || 0));
  else list.sort((a, b) => (b.quantityVendu || 0) - (a.quantityVendu || 0));
  return list;
}
```

- `price-low`: ascending price (`a.price - b.price`).
- `price-high`: descending price (`b.price - a.price`).
- Default: sort by `quantityVendu` (sold quantity) descending.
- Uses `|| 0` for missing numeric values.

---

### Component State (Lines 36–54)

```javascript
const initialFilters = { search: '', sort: 'default', categories: [], skinTypes: [] };
```

Initial filter state.

---

```javascript
  const dispatch = useDispatch();
  const { productsData, loading, error } = useSelector((state) => state.products);
```

- Redux dispatch and product data, loading, and error from store.

---

```javascript
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
```

- `isFilterOpen`: mobile filter drawer visibility.
- `filters`: current search, sort, categories, skin types.

---

```javascript
  useEffect(() => {
    if (!productsData?.length) dispatch(fetchProducts());
  }, [dispatch, productsData]);
```

- Load products when none are present in Redux.

---

```javascript
  const clearFilters = () => setFilters(initialFilters);
```

- Resets all filters to their initial values.

---

```javascript
  const activeFilterCount = filters.categories.length + filters.skinTypes.length;
```

- Count of selected categories and skin types (used for badge on mobile filter button).

---

```javascript
  const filteredProducts = useMemo(
    () => filterAndSortProducts(productsData, filters),
    [productsData, filters]
  );
```

- Runs `filterAndSortProducts` only when `productsData` or `filters` change.
- Avoids re-filtering on every render.

---

### SearchBar (Lines 79–84)

```javascript
<SearchBar
  value={filters.search}
  onChange={(value) => setFilters((f) => ({ ...f, search: value }))}
  placeholder="Search products..."
/>
```

- `value`: controlled by `filters.search`.
- `onChange`: updates only `search` in the filters object.

---

### SortSelect (Lines 88–92)

```javascript
<SortSelect
  value={filters.sort}
  onChange={(value) => setFilters((f) => ({ ...f, sort: value }))}
/>
```

- Controlled by `filters.sort`.
- Updates `sort` without touching other filters.

---

### FiltersSidebar (Lines 114–118)

```javascript
<FiltersSidebar
  filters={filters}
  setFilters={setFilters}
  onClearFilters={clearFilters}
/>
```

- Receives full `filters` and `setFilters` so it can update `categories` and `skinTypes`.
- `onClearFilters` resets all filters.

---

### MobileFilterDrawer (Lines 183–193)

```javascript
<MobileFilterDrawer
  isOpen={isFilterOpen}
  onClose={() => setIsFilterOpen(false)}
  filters={filters}
  setFilters={setFilters}
  onClearFilters={clearFilters}
  resultCount={filteredProducts.length}
/>
```

- Same filter logic as desktop sidebar.
- Uses a drawer on mobile and shows number of filtered products.

---

## 4. FiltersSidebar.jsx — Line-by-Line

### CheckboxItem (Lines 16–48)

```javascript
function CheckboxItem({ label, checked, onChange }) {
```

Reusable checkbox for filter options.

---

```javascript
  <label className="flex items-center gap-3 py-2 cursor-pointer group">
```

- Clicking anywhere on the label toggles the checkbox.
- `group` used for hover styles.

---

```javascript
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="sr-only"
  />
```

- Hidden native checkbox for accessibility.
- `sr-only`: visually hidden but kept for screen readers.

---

```javascript
  <div className={`w-5 h-5 rounded border-2 ... ${checked ? 'bg-[#9E3B3B] border-[#9E3B3B]' : 'border-gray-300 ...'}`}>
    {checked && <svg ... checkmark ... />}
  </div>
```

- Custom checkbox UI; shows checkmark when checked.

---

### FilterSection (Lines 51–62)

Simple wrapper with a title and content area for each filter group.

---

### Category and Skin Type Options (Lines 71–86)

```javascript
  const categories = [
    { value: 'cleanser', label: 'Cleansers' },
    { value: 'serum', label: 'Serums' },
    // ...
  ];

  const skinTypes = [
    { value: 'dry', label: 'Dry' },
    // ...
  ];
```

- `value`: stored in filter state and matched against product fields.
- `label`: displayed in the UI.

---

### Toggle Logic (Lines 88–106)

```javascript
  const toggleCategory = (categoryValue) => {
    const isSelected = filters.categories.includes(categoryValue);
    const newCategories = isSelected
      ? filters.categories.filter(c => c !== categoryValue)  // Remove
      : [...filters.categories, categoryValue];             // Add
    setFilters({ ...filters, categories: newCategories });
  };
```

- If value is already selected: remove it from `categories`.
- Otherwise: add it.
- Same pattern for `toggleSkinType` with `skinTypes`.

---

### hasActiveFilters (Line 109)

```javascript
  const hasActiveFilters = filters.categories.length > 0 || filters.skinTypes.length > 0;
```

- Used to show the "Clear" button only when at least one filter is active.

---

### MobileFilterDrawer (Lines 160–209)

- Renders when `isOpen` is true.
- Backdrop closes the drawer on click.
- Slide-in panel from the left with full `FiltersSidebar` inside.
- Footer shows "Show {resultCount} Products" and closes the drawer.

---

## 5. SearchBar.jsx — Line-by-Line

```javascript
export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
```

- Controlled input with `value` and `onChange`.

---

```javascript
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    ...
  />
```

- On change, calls `onChange` with the new string.

---

```javascript
  {value && (
    <button onClick={() => onChange('')} ... >
      <X className="w-4 h-4" />
    </button>
  )}
```

- Clear button visible when there is text; clears search by calling `onChange('')`.

---

## 6. SortSelect.jsx — Line-by-Line

```javascript
  const sortOptions = [
    { value: 'default', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];
```

- `default` → sort by `quantityVendu` descending.
- `price-low` / `price-high` → ascending / descending price.

---

```javascript
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    ...
  >
```

- Controlled select; passes the selected option’s `value` to `onChange`.

---

## 7. ProductGrid.jsx — Flow

- Receives `products` (already filtered and sorted by Catalogue).
- Shows skeletons when `loading` is true.
- Shows `EmptyState` with "Clear Filters" when `products` is empty.
- Otherwise renders a grid of `ProductCard` components.

---

## 8. Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                         Catalogue.jsx                            │
│  filters (search, sort, categories, skinTypes)                   │
│       │                                                          │
│       ▼                                                          │
│  filterAndSortProducts(productsData, filters)                    │
│       │                                                          │
│       ▼                                                          │
│  filteredProducts (memoized)                                     │
└─────────────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
   SearchBar           SortSelect          FiltersSidebar
   (search)            (sort)              (categories, skinTypes)
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    setFilters() updates filters
                             │
                             ▼
                    filteredProducts recomputed
                             │
                             ▼
                       ProductGrid
```

---

## 9. Matching Rules

| Filter | Product Field | Match Rule |
|--------|---------------|------------|
| Search | `p.name` | Substring (case-insensitive) |
| Categories | `p.subcategory` | Product `subcategory` includes any selected category |
| Skin Types | `p.skinType` | Product `skinType` includes any selected skin type |

- Categories and skin types use **OR** within each group.
- Between search, categories, and skin types, all conditions must be true (**AND**).
