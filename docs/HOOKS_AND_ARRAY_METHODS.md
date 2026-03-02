# React Hooks & Array Methods Reference

This document describes all React hooks and array methods used in the **Beauty Match** project, with file locations and usage examples.

---

## 1. React Hooks

### `useState`

Manages local component state. Returns `[value, setter]`.

| File | What it stores |
|------|----------------|
| `src/pages/Admin/AdminLogin.jsx` | `username`, `password`, `showPassword`, `error`, `isLoading` |
| `src/pages/Admin/addProduct.jsx` | `product` (form data) |
| `src/pages/Admin/Dashboard.jsx` | `orders`, `ordersLoading` |
| `src/pages/Admin/ManageProducts.jsx` | `modal`, `searchTerm`, `stockFilter`, `currentPage` |
| `src/pages/Admin/Orders.jsx` | `orders`, `loading`, `search`, `page` |
| `src/pages/User/Checkout.jsx` | `formData`, `errors`, `isConfirmed`, `isSubmitting` |
| `src/pages/User/Catalogue.jsx` | `isFilterOpen`, `filters` |
| `src/pages/User/SkinQuiz.jsx` | `viewMode`, `currentStep`, `answers`, `quizResult`, `recommendations`, `isLoading`, `error` |
| `src/components/layout/Navbar.jsx` | `isAdmin`, `isMobileOpen` |
| `src/components/layout/AdminSidebar.jsx` | `isOpen` |
| `src/components/layout/HeroImageSlider.jsx` | `index` (current slide) |
| `src/components/shop/ProductCard.jsx` | `isHovered` |
| `src/components/admin/PopUpUpdate.jsx` | `formData` |
| `src/components/Toast.jsx` | `toast` (current toast message) |

---

### `useEffect`

Runs side effects after render. Used for data fetching, subscriptions, DOM updates.

| File | Purpose |
|------|---------|
| `src/App.jsx` | On mount, dispatch `loadUserFromStorage()` to restore user from localStorage |
| `src/pages/User/Catalogue.jsx` | Fetch products when `productsData` is empty: `dispatch(fetchProducts())` |
| `src/pages/User/Home.jsx` | Fetch products when not loaded |
| `src/pages/User/ProductDetails.jsx` | Fetch products when `id` param changes, so product details load correctly |
| `src/pages/User/SkinQuiz.jsx` | 1) Fetch products on mount; 2) Scroll to results when quiz completes |
| `src/pages/Admin/Dashboard.jsx` | 1) Fetch orders on mount; 2) Fetch products on mount |
| `src/pages/Admin/ManageProducts.jsx` | Fetch products on mount |
| `src/pages/Admin/Orders.jsx` | Fetch orders on mount with cleanup (cancelled flag) to avoid state updates after unmount |
| `src/components/layout/Navbar.jsx` | Sync admin login status from localStorage and listen to `storage` events (e.g. login in another tab) |
| `src/components/layout/HeroImageSlider.jsx` | Auto-advance slides with `setInterval` |
| `src/components/admin/PopUpUpdate.jsx` | Reset form when modal opens with a product: `setFormData(productToForm(productToUpdate))` |

---

### `useMemo`

Memoizes computed values to avoid recalculation on every render.

| File | What it memoizes |
|------|------------------|
| `src/pages/User/Catalogue.jsx` | `filteredProducts` – filtered and sorted product list from `filterAndSortProducts(productsData, filters)` |
| `src/pages/Admin/Orders.jsx` | `filteredOrders` – orders matching search; `paginatedOrders` – slice for current page |

---

### `useContext` / `createContext`

Provides global state without prop drilling. `useToast` uses `useContext(ToastContext)`.

| File | Usage |
|------|-------|
| `src/components/Toast.jsx` | `ToastContext` and `useToast()` – show success/error toasts anywhere via `useToast().showToast(message, type)` |

---

### `useNavigate` (React Router)

Programmatic navigation.

| File | Usage |
|------|-------|
| `src/components/quiz/ResultsScreen.jsx` | Navigate to product details or checkout |
| `src/components/layout/AdminSidebar.jsx` | Navigate on logout |
| `src/components/cart/CartSidebar.jsx` | Navigate to checkout |
| `src/pages/User/Checkout.jsx` | Navigate after order confirmation |
| `src/pages/Admin/AdminLogin.jsx` | Navigate to dashboard on successful login |
| `src/pages/Admin/addProduct.jsx` | Navigate after adding a product |

---

### `useParams` (React Router)

Reads dynamic route parameters.

| File | Usage |
|------|-------|
| `src/pages/User/ProductDetails.jsx` | `const { id } = useParams()` – get product ID from `/products/:id` |

---

### `useSelector` / `useDispatch` (Redux)

Access Redux state and dispatch actions.

| File | What it selects/dispatches |
|------|----------------------------|
| `src/App.jsx` | `useDispatch` – load user on mount |
| `src/pages/User/Catalogue.jsx` | `useSelector` (productsData, loading, error), `useDispatch` (fetchProducts) |
| `src/pages/User/Home.jsx` | `useSelector` (productsData), `useDispatch` |
| `src/pages/User/ProductDetails.jsx` | `useSelector` (productsData, loading, isInCart, quantityInCart), `useDispatch` |
| `src/pages/User/Checkout.jsx` | `useSelector` (cartItems, subtotal), `useDispatch` |
| `src/pages/User/SkinQuiz.jsx` | `useSelector` (productsData, savedQuizResult, savedRecommendations), `useDispatch` |
| `src/pages/Admin/Dashboard.jsx` | `useSelector` (productsData, loading), `useDispatch` |
| `src/pages/Admin/ManageProducts.jsx` | `useSelector` (productsData, loading), `useDispatch` |
| `src/pages/Admin/addProduct.jsx` | `useSelector` (loading), `useDispatch` |
| `src/components/layout/Navbar.jsx` | `useSelector` (cartQuantity), `useDispatch` |
| `src/components/cart/CartSidebar.jsx` | `useSelector` (isOpen, items, totalPrice, totalQuantity, isEmpty), `useDispatch` |
| `src/components/shop/ProductCard.jsx` | `useSelector` (isInCart), `useDispatch` |
| `src/features/cart/CartItem.jsx` | `useDispatch` (add, remove, update quantity) |
| `src/components/quiz/RecommendedProductCard.jsx` | `useSelector` (isInCart) |
| `src/components/admin/PopUpUpdate.jsx` | `useSelector` (loading), `useDispatch` |
| `src/components/admin/popUpDelete.jsx` | `useDispatch` |

---

## 2. Array Methods

### `.map()`

Transforms each element and returns a new array. Used for rendering lists and reshaping data.

| File | Usage |
|------|-------|
| `src/pages/User/Catalogue.jsx` | Inside `filterAndSortProducts` (via filters applied to list) |
| `src/pages/Admin/Orders.jsx` | `paginatedOrders.map((order) => ...)` – table rows and mobile cards |
| `src/pages/Admin/Dashboard.jsx` | `stats.map(...)`, `lowStockProducts.slice(0, 6).map((product) => ...)` |
| `src/pages/Admin/ManageProducts.jsx` | `currentProducts.map((product) => ...)`, pagination `[...Array(totalPages)].map(...)` |
| `src/pages/Admin/addProduct.jsx` | `options.map((o) => ...)` |
| `src/pages/User/Home.jsx` | `featuredProducts.map(...)`, testimonials, `[...Array(5)].map(...)` for stars |
| `src/pages/User/ProductDetails.jsx` | `ingredients.split(',').map((i) => i.trim()).filter(Boolean)`, `ingredients.slice(0, 6).map(...)` |
| `src/pages/User/Checkout.jsx` | `cartItems.map((item) => ({ id, name, ... }))`, `cartItems.map((item) => ...)` for display |
| `src/components/admin/DashboardComponents.jsx` | `products.map((product) => ...)` |
| `src/components/admin/PopUpUpdate.jsx` | `formData.ingredients.split(',').map((i) => i.trim())`, `options.map(...)` |
| `src/components/shop/ProductGrid.jsx` | `products.map(product => ...)`, `[...Array(8)].map(...)` for skeleton |
| `src/components/shop/FiltersSidebar.jsx` | `categories.map(...)`, `skinTypes.map(...)` |
| `src/components/shop/SortSelect.jsx` | `sortOptions.map(...)` |
| `src/components/quiz/ResultsScreen.jsx` | `quizResult.concerns.map(...)`, `Object.entries(routineSteps).map(...)` |
| `src/components/quiz/QuizScreen.jsx` | `question.options.map(...)` |
| `src/components/cart/CartSidebar.jsx` | `items.map((item) => ...)` |
| `src/utils/analyzeQuizResult.js` | `answers.map((answerIndex, questionIndex) => ...)` to get answer texts |
| `src/utils/analyzeQuizResult.js` | `concerns.map(c => mapping[c] || c)` – map concerns to French |
| `src/lib/aiPrompt.js` | `relevantProducts.map(p => ...)` for prompt text, `products.map(p => ...)` |

---

### `.filter()`

Keeps elements that match a condition.

| File | Usage |
|------|-------|
| `src/pages/User/Catalogue.jsx` | Filter by search, categories, skin types |
| `src/pages/Admin/Dashboard.jsx` | `lowStockProducts`, `outOfStockCount`, best sellers by `quantityVendu > 80` |
| `src/pages/Admin/ManageProducts.jsx` | `filteredProducts` – filter by search term |
| `src/pages/Admin/Orders.jsx` | `filteredOrders` – search by id, userName, userEmail |
| `src/pages/User/ProductDetails.jsx` | `ingredients.split(',').map(...).filter(Boolean)` |
| `src/pages/User/Home.jsx` | `featuredProducts = productsData?.filter(p => p.tags === 'best-seller')` |
| `src/components/shop/FiltersSidebar.jsx` | `filters.categories.filter(c => c !== categoryValue)` when toggling filters |
| `src/features/cart/cartSlice.js` | `state.items.filter(item => item.id !== productId)` – remove from cart |
| `src/features/cart/cartSelectors.js` | `state.cart.items.find(...)` – item lookup |
| `src/features/products/productsSlice.js` | `state.productsData.filter((p) => p.id !== action.payload)` – delete product |
| `src/lib/aiPrompt.js` | `products.filter(p => ...)` – keep only allowed categories |
| `src/services/aiRecommendation.js` | `products.filter(...)` – match category for routine |

---

### `.reduce()`

Aggregates an array into a single value.

| File | Usage |
|------|-------|
| `src/features/cart/cartSlice.js` | `calculateTotals` – `items.reduce(...)` → `{ totalQuantity, totalPrice }` |
| `src/pages/Admin/Dashboard.jsx` | `totalSales`, `totalStock` – sum over orders/products |
| `src/utils/analyzeQuizResult.js` | `Object.keys(scores).reduce((a, b) => ...)` – skin type with max score |

---

### `.find()`

Returns the first element that matches.

| File | Usage |
|------|-------|
| `src/features/cart/cartSlice.js` | Find item by id for add/increase/decrease |
| `src/features/cart/cartSelectors.js` | `selectIsInCart`, `selectItemQuantity` – find cart item by productId |
| `src/pages/User/ProductDetails.jsx` | `productsData?.find((p) => p.id === id)` |
| `src/components/quiz/ResultsScreen.jsx` | `productsData?.find((p) => p.id === id)` – get product by ID |

---

### `.some()`

Checks if at least one element matches.

| File | Usage |
|------|-------|
| `src/features/cart/cartSelectors.js` | `selectIsInCart` – `items.some(item => item.id === productId)` |
| `src/pages/User/Catalogue.jsx` | `filters.categories.some(...)`, `filters.skinTypes.some(...)` for filter logic |
| `src/lib/aiPrompt.js` | `ALLOWED_CATEGORIES.some(cat => text.includes(cat))` |
| `src/services/aiRecommendation.js` | `categories.some(c => cat.includes(c.toLowerCase()))` |

---

### `.sort()`

Sorts in place. Used with copy when you must not mutate the original array.

| File | Usage |
|------|-------|
| `src/pages/User/Catalogue.jsx` | Sort by price (low/high) or best sellers |
| `src/pages/Admin/Dashboard.jsx` | Best sellers: `.sort((a, b) => (b.quantityVendu \|\| 0) - (a.quantityVendu \|\| 0))` |
| `src/pages/Admin/ManageProducts.jsx` | `sortedProducts` – by stock (highToLow/lowToHigh) |
| `src/services/aiRecommendation.js` | `matching.sort((a, b) => scoreProduct(b) - scoreProduct(a))` – best match first |

---

### `.slice()`

Returns a portion of an array. Does not mutate.

| File | Usage |
|------|-------|
| `src/pages/Admin/Dashboard.jsx` | `lowStockProducts.slice(0, 6)` – show top 6 |
| `src/pages/Admin/Orders.jsx` | `filteredOrders.slice(start, start + FIXED_PAGE_SIZE)` – pagination |
| `src/pages/Admin/ManageProducts.jsx` | `sortedProducts.slice(startIndex, endIndex)` – current page products |
| `src/pages/User/ProductDetails.jsx` | `ingredients.slice(0, 6)` – show first 6 ingredients |
| `src/pages/User/Catalogue.jsx` | `let list = [...products]` (copy before filter/sort) |

---

### `.includes()`

Checks if a value exists in an array or string.

| File | Usage |
|------|-------|
| `src/components/shop/FiltersSidebar.jsx` | `filters.categories.includes(categoryValue)` |
| `src/pages/User/Catalogue.jsx` | `(p.name \|\| '').toLowerCase().includes(q)` for search |
| `src/pages/Admin/Orders.jsx` | `String(o.id).toLowerCase().includes(q)` |
| `src/services/aiRecommendation.js` | `productSkinType.includes(skinType)`, `productConcerns.includes(concern)` |
| `src/lib/aiPrompt.js` | `text.includes(cat)` |

---

### `.forEach()`

Iterates over elements (no return value).

| File | Usage |
|------|-------|
| `src/services/aiRecommendation.js` | `concerns.forEach(...)`, `goodIngredients.forEach(...)` – score products |

---

### `.join()`

Joins array elements into a string.

| File | Usage |
|------|-------|
| `src/lib/aiPrompt.js` | `productsText = relevantProducts.map(...).join('\n')`, `concerns.join(', ')` |
| `src/services/aiRecommendation.js` | `product.ingredients.join(' ')`, `concerns.join(' and ')` |
| `src/components/admin/PopUpUpdate.jsx` | `p.ingredients.join(', ')` – display ingredients as comma-separated |

---

### `.fill()`

Fills array with a value.

| File | Usage |
|------|-------|
| `src/pages/User/SkinQuiz.jsx` | `Array(quizQuestions.length).fill(null)` – initial empty answers |

---

### `Array.isArray()`

Checks if a value is an array.

| File | Usage |
|------|-------|
| `src/pages/Admin/Dashboard.jsx` | `Array.isArray(data) ? data : []` |
| `src/pages/Admin/Orders.jsx` | Same for orders response |
| `src/pages/User/ProductDetails.jsx` | `Array.isArray(ingredients) ? ingredients : []` |
| `src/components/admin/PopUpUpdate.jsx` | `Array.isArray(p.ingredients) ? p.ingredients.join(', ') : ...` |
| `src/services/aiRecommendation.js` | `Array.isArray(product.ingredients)` |

---

### `Object.entries()` / `Object.keys()`

Used with arrays/objects in iteration and validation.

| File | Usage |
|------|-------|
| `src/components/quiz/ResultsScreen.jsx` | `Object.entries(routineSteps).map(([key, stepInfo]) => ...)` – render routine steps |
| `src/utils/analyzeQuizResult.js` | `Object.keys(scores).reduce(...)` – find skin type with max score |
| `src/pages/User/Checkout.jsx` | `Object.keys(newErrors).length === 0` – validation (no errors) |

---

## Summary Table

| Hook / Method | Primary use in project |
|---------------|------------------------|
| **useState** | Form data, UI toggles, loading, pagination |
| **useEffect** | Fetch products/orders, load user, sync admin status, form reset in modals |
| **useMemo** | Filtered/sorted products, filtered and paginated orders |
| **useContext** | Toast notifications (`useToast`) |
| **useNavigate** | Go to checkout, product details, dashboard |
| **useParams** | Product ID from URL |
| **useSelector / useDispatch** | Redux cart, products, user, admin actions |
| **.map()** | Render lists, transform data, build prompt strings |
| **.filter()** | Search, filters, remove cart item, keep allowed categories |
| **.reduce()** | Totals (cart, sales, stock), skin type with max score |
| **.find()** | Look up product or cart item by ID |
| **.some()** | Check if item in cart, match filters |
| **.sort()** | Price, best sellers, stock |
| **.slice()** | Pagination, show top N items |
| **.includes()** | Search, filter checks |
| **.forEach()** | Iterate to score products (aiRecommendation) |
| **.join()** | Join arrays for display or prompts |
| **.fill()** | Initialize quiz answers array |
