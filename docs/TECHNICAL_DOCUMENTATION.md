# BeautyMatch — Complete Technical Documentation

This document explains the entire BeautyMatch project in a **beginner-friendly** way. No code refactoring—only explanations of what exists, why it exists, and how everything connects.

---

# 1. Products Feature Documentation

## 1.1 Overview

The **Products** feature is responsible for loading, displaying, creating, updating, and deleting skincare products. Product data comes from **MockAPI** (a fake REST API). The list is stored in **Redux** so that multiple pages (Home, Catalogue, ProductDetails, Admin ManageProducts, Skin Quiz) can use the same data without fetching it again and again.

**In simple words:** When you open the app or go to the catalogue, the app asks MockAPI “give me all products.” The answer is saved in Redux. Every page that needs products reads from that same place.

---

## 1.2 File Structure

```
src/
├── app/
│   └── store.js                    # Registers productsReducer
├── features/
│   └── products/
│       ├── productsSlice.js        # Redux state: productsData, loading, error, success
│       ├── productsThunks.js       # Async: fetchProducts, createProduct, updateProduct deleteProduct
│       ├── productsAPI.js          # Axios calls to MockAPI
│       └── ProductFilters.jsx      # Admin: search + stock filter UI
├── pages/
│   ├── User/
│   │   ├── Home.jsx                # Uses productsData for best sellers
│   │   ├── Catalogue.jsx           # Dispatches fetchProducts, filters/sorts, shows ProductGrid
│   │   └── ProductDetails.jsx      # Finds product by ID from productsData
│   └── Admin/
│       ├── ManageProducts.jsx      # Fetches products, table + delete/update modals
│       └── addProduct.jsx          # Form → createProduct thunk
├── components/
│   ├── shop/
│   │   ├── ProductCard.jsx         # One product card, Add to Cart
│   │   ├── ProductGrid.jsx         # Grid of ProductCards, loading/empty states
│   │   ├── SearchBar.jsx          # Search input (Catalogue)
│   │   ├── SortSelect.jsx          # Sort dropdown (Catalogue)
│   │   └── FiltersSidebar.jsx     # Category/skin type filters (Catalogue)
│   ├── PopUpUpdate.jsx            # Modal to edit product (Admin)
│   └── popUpDelete.jsx            # Modal to confirm delete (Admin)
```

---

## 1.3 Architecture Relation

| Who uses it | How |
|-------------|-----|
| **Catalogue** | Dispatches `fetchProducts()`, reads `productsData`, `loading`, `error`; filters/sorts in component; renders `ProductGrid`. |
| **Home** | Dispatches `fetchProducts()` if no data; reads `productsData` to show best sellers. |
| **ProductDetails** | Reads `productsData`, finds product by `id` from URL. |
| **SkinQuiz** | Dispatches `fetchProducts()`; uses `productsData` to get full product details for recommended items. |
| **ManageProducts** | Dispatches `fetchProducts()`, `deleteProduct()`, `updateProduct()`; uses PopUpUpdate/popUpDelete. |
| **addProduct** | Dispatches `createProduct(newProduct)`. |
| **Redux slice** | `products` slice in store; updated by thunks (pending/fulfilled/rejected). |
| **API** | `productsAPI.js` → MockAPI base URL (env: `VITE_MOCKAPI_PRODUCTS_URL`). |

---

## 1.4 Data Flow

**Loading products (e.g. on Catalogue):**

```
User opens /catalogue
   ↓
Catalogue useEffect runs
   ↓
dispatch(fetchProducts())
   ↓
productsThunks.fetchProducts runs
   ↓
productsSlice: fetchProducts.pending → state.loading = true, state.error = null
   ↓
productsAPI.getProducts() → axios.get(API_URL)
   ↓
MockAPI returns array of products
   ↓
Thunk returns data → productsSlice: fetchProducts.fulfilled → state.productsData = payload, state.loading = false
   ↓
Catalogue useSelector(state => state.products) gets new state
   ↓
Component re-renders with productsData, loading false
   ↓
filterAndSortProducts(productsData, filters) → filtered list → ProductGrid → ProductCards
```

**If the API fails:**

```
productsAPI.getProducts() throws
   ↓
Thunk catch → rejectWithValue(err.message)
   ↓
productsSlice: fetchProducts.rejected → state.loading = false, state.error = action.payload
   ↓
Catalogue re-renders, shows error UI + "Try Again" button that dispatches fetchProducts() again
```

---

## 1.5 Redux Slice Explanation (productsSlice.js)

**Initial state:**

```javascript
{
  productsData: [],   // Array of product objects from MockAPI
  error: null,        // Error message if fetch/create/update/delete failed
  loading: false,    // True while any async thunk is in progress
  success: false     // True after create or update succeeds (can show toast then clear)
}
```

**Reducers (synchronous):**

- **clearError** — Sets `state.error = null`. Used after showing an error toast so the message doesn’t stick.
- **clearSuccess** — Sets `state.success = false`. Used after showing a success message so the flag doesn’t stick.

**ExtraReducers (async thunks):**

- **fetchProducts**
  - `pending`: `loading = true`, `error = null`
  - `fulfilled`: `loading = false`, `productsData = action.payload` (or `[]`)
  - `rejected`: `loading = false`, `error = action.payload`
- **deleteProduct**
  - `pending`: `loading = true`, `error = null`
  - `fulfilled`: `loading = false`, remove from `productsData` the product whose `id === action.payload`
  - `rejected`: `loading = false`, `error = action.payload`
- **createProduct**
  - `pending`: `loading = true`, `error = null`, `success = false`
  - `fulfilled`: `loading = false`, `success = true`, push `action.payload` into `productsData`
  - `rejected`: `loading = false`, `error = action.payload`, `success = false`
- **updateProduct**
  - `pending`: same as create
  - `fulfilled`: `loading = false`, find product in `productsData` by `id` and replace with `action.payload`, `success = true`
  - `rejected`: same as create

**Why this shape?** One place holds the list (`productsData`), one flag for “something is loading” (`loading`), one for user-facing errors (`error`), and one for “operation succeeded” (`success`) so the UI can show toasts and then reset.

---

## 1.6 Selectors

Products slice does **not** export its own selectors. Components use:

- `useSelector((state) => state.products)` or
- `useSelector((state) => state.products.productsData)` etc.

So “selectors” here are just inline: `state.products`, `state.products.productsData`, `state.products.loading`, `state.products.error`. Using a selector function (e.g. `selectProductsData`) would centralize the path and make it easier to change the state shape later.

---

## 1.7 API Layer (productsAPI.js)

- **Base URL:** `VITE_MOCKAPI_PRODUCTS_URL` or default MockAPI URL.
- **getProducts()** — `GET` base URL. Returns `res.data` (array). Throws on error so thunks can catch and `rejectWithValue`.
- **addProduct(newProduct)** — `POST` base URL, body `newProduct`. Returns `res.data` (created product with `id`).
- **updateProduct(productToUpdate)** — `PUT` base URL + `/${productToUpdate.id}`, body = full product. Returns `res.data`.
- **deleteProduct(productId)** — `DELETE` base URL + `/${productId}`. Returns nothing; throws on error.

All are async; errors are handled in thunks.

---

## 1.8 Component Breakdown (summary)

- **Catalogue:** `useEffect` dispatches `fetchProducts()` if `productsData` is empty. Local state: `filters` (search, sort, categories, skinTypes), `isFilterOpen`. Renders SearchBar, SortSelect, FiltersSidebar, ProductGrid. Filtering/sorting is done in `filterAndSortProducts(productsData, filters)` (no Redux).
- **ProductCard:** Props: `product`. Uses `useSelector(selectIsInCart)`, `useDispatch`. On “Add to Cart”: `dispatch(addToCart(...))`, toast, `dispatch(openCart())`.
- **ProductGrid:** Props: `products`, `loading`, `onClearFilters`. Shows skeletons when loading, empty state when no products, else grid of ProductCards.
- **ManageProducts:** Fetches products on mount. Local state: `modal` (delete/update), `searchTerm`, `stockFilter`, `currentPage`. Table + pagination; delete opens popUpDelete; update opens PopUpUpdate; both dispatch thunks and close modal.
- **PopUpUpdate / popUpDelete:** Controlled by parent (open/close, product to edit/delete). On confirm they dispatch `updateProduct` / `deleteProduct` and call `onClose()` and show toast.

---

## 1.9 Logic Explanation (plain English)

- **When user opens Catalogue:** If there are no products in Redux, the app fetches them from MockAPI. While loading, the grid shows skeletons. When data arrives, the list is filtered and sorted by the current filters and displayed. If the request fails, an error message and “Try Again” are shown.
- **When user clicks “Add to Cart” on a product:** The product summary (id, name, price, imageUrl, category) is sent to the cart slice, a success toast appears, and the cart sidebar opens. The product list in Redux does not change.
- **When admin deletes a product:** The delete thunk calls the API; on success the reducer removes that product from `productsData`, so the table and any page using that list update automatically.
- **When admin updates a product:** Same idea: API call, then reducer replaces the product in `productsData` by id.

---

## 1.10 State Management Explanation

- **Products in Redux:** So that many pages share the same source of truth and we don’t refetch on every navigation. One fetch (or one refetch) updates everyone.
- **Filter/sort in component state:** Filters and sort are UI-only; the full list stays in Redux and the component derives “what to show” with `filterAndSortProducts`. If we put filters in Redux we could, but it’s not required for this app.

---

## 1.11 Simplified Mental Model

Think of products as a **shared list in a central cabinet (Redux)**. When you open the shop page, someone (the thunk) goes to MockAPI, gets the list, and puts it in the cabinet. Every page that needs products looks in the cabinet. When an admin adds, edits, or deletes a product, the thunk talks to MockAPI and then the cabinet is updated; everyone reading from the cabinet sees the change.

---

## 1.12 Possible Jury Questions

- **Where is the product list stored?**  
  In Redux: `state.products.productsData`. Loaded by the `fetchProducts` thunk from MockAPI.

- **Why use MockAPI?**  
  To simulate a real backend without a real server; same HTTP (GET/POST/PUT/DELETE) and async flow as with a real API.

- **Where is filtering/sorting done?**  
  In `Catalogue.jsx`, function `filterAndSortProducts(products, filters)`. It filters by search, category, skin type and sorts by price or best seller; Redux only holds the raw list.

- **What is Immer in the slice?**  
  Redux Toolkit uses Immer. You can write “mutating” logic (e.g. `state.productsData.push(...)`) and Immer produces an immutable update underneath, so we don’t have to spread state by hand.

---

# 2. User Feature Documentation

## 2.1 Overview

The **User** feature handles the **shopper’s **skin quiz result** (skin type, concerns, age range), and **AI recommendations** (routine + summary). There is **no real backend**: everything is stored in **localStorage** via `userAPI.js`. So “login” and “logout” are really “save/load/clear this data in the browser.”

**In simple words:** When you “sign in” or “create profile,” we save your name and email (and any quiz/recommendations you already have) in the browser. When you take the quiz, we save the result and recommendations. When you come back later, we load that from the browser and put it in Redux so the app “remembers” you.

---

## 2.2 File Structure

```
src/
├── features/
│   └── user/
│       ├── userSlice.js      # State: quizResult, recommendations, loading, error
│       ├── userThunks.js     # loadUserFromStorage, saveQuizResultThunk, saveRecommendationsThunk, clearQuizDataThunk
│       └── userAPI.js        # localStorage: saveUser, loadUser, updateUser
├── pages/
│   └── User/
│       └── SkinQuiz.jsx      # Route entry: Redux, state, effects, handlers; renders UI subcomponents
├── components/
│   └── quiz/
│       ├── QuizComponents.jsx       # ProgressBar, QuestionCard, QuizButton
│       └── SkinQuiz/                # UI-only subcomponents
│           ├── IntroScreen.jsx      # Intro + Start button
│           ├── QuizScreen.jsx       # Questions, answers, navigation
│           ├── LoadingScreen.jsx    # Loading state
│           ├── ErrorScreen.jsx      # Error message + Try Again
│           ├── ResultsScreen.jsx    # Skin type, AI summary, routine
│           └── RecommendedProductCard.jsx  # Product card with Add to Cart
├── data/
│   └── skinQuizData.js      # quizQuestions, skinTypeInfo, routineSteps
├── App.jsx                   # On mount: dispatch(loadUserFromStorage())
```

---

## 2.3 Architecture Relation

- **App.jsx** — On mount dispatches `loadUserFromStorage()` so that saved quiz data is restored from localStorage to Redux.
- **SkinQuiz.jsx** — Route entry page; holds all logic (Redux, state, effects, handlers). Reads saved `quizResult` and `recommendations`; dispatches `saveQuizResultThunk`, `saveRecommendationsThunk`, `clearQuizDataThunk`. Renders IntroScreen, QuizScreen, LoadingScreen, ErrorScreen, ResultsScreen based on viewMode.
- **Navbar** — Cart icon and Admin link only; no user profile or login UI.
- **Checkout** — Reads cart and form data only; order is created from form + cart.

---

## 2.4 Data Flow

**App load (restore quiz data):**

```
App mounts
   ↓
useEffect → dispatch(loadUserFromStorage())
   ↓
userThunks.loadUserFromStorage: calls userAPI.loadUser() (localStorage)
   ↓
loadUserFromStorage.fulfilled → userSlice sets quizResult, recommendations
   ↓
SkinQuiz useSelector(selectQuizResult, selectRecommendations) gets state
   ↓
If saved data exists, results view is shown
```

**Save quiz result (after quiz completes):**

```
SkinQuiz: analyzeAnswers(answers) → result; getRecommendations(result, products) → recs
   ↓
dispatch(saveQuizResultThunk(result)), dispatch(saveRecommendationsThunk(recs))
   ↓
Thunks call userAPI.updateUser({ quizResult }) / updateUser({ recommendations })
   ↓
saveQuizResultThunk.fulfilled / saveRecommendationsThunk.fulfilled → userSlice updates state
   ↓
Data persists in localStorage
```

---

## 2.5 Redux Slice Explanation (userSlice.js)

**Initial state:**

```javascript
{
  quizResult: null,        // { skinType, concerns, ageRange }
  recommendations: null,   // { routine: { cleanser, serum, moisturizer, sunscreen }, summary }
  loading: false,
  error: null
}
```

**Reducers:**  
`setQuizResult`, `setRecommendations`, `clearError`. Used for direct sync updates if needed.

**ExtraReducers:**  
Handle thunks: `loadUserFromStorage`, `saveQuizResultThunk`, `saveRecommendationsThunk`, `clearQuizDataThunk`. On fulfilled they set the corresponding state; on rejected they set `error`. So the “source of truth” after any async action is the slice.

---

## 2.6 Selectors

Defined in `userSlice.js`:

- **selectQuizResult** — `state.user.quizResult`
- **selectRecommendations** — `state.user.recommendations`
- **selectUserLoading** — `state.user.loading`

---

## 2.7 API Layer (userAPI.js — localStorage)

- **saveUser(userData)** — `localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))`.
- **loadUser()** — `localStorage.getItem(STORAGE_KEY)` → parse JSON or null.
- **updateUser(updates)** — Load existing, merge `updates`, save back (for quiz result and recommendations).

No HTTP; all sync. Thunks are still async so we keep the same Redux pattern (pending/fulfilled/rejected).

---

## 2.8 Logic Explanation

- **Page load:** App runs `loadUserFromStorage`. If there is quiz data in localStorage, Redux gets quizResult and recommendations.
- **User takes quiz:** At the end, quiz result and recommendations are saved to Redux and localStorage. Results screen shows routine, "Shop Products" and "Retake Quiz" buttons.
- **User clicks "Retake Quiz":** `clearQuizDataThunk` clears quiz data from Redux and localStorage; local state resets so the quiz starts over.

---

## 2.9 State Management

- **Redux:** One place for quiz result and recommendations so SkinQuiz can read and update them.
- **localStorage:** Persistence so that closing the browser doesn't lose the quiz results.

---

## 2.10 Simplified Mental Model

Quiz data is a **notebook** (localStorage) and a **whiteboard** (Redux). When the app starts, we copy from the notebook to the whiteboard. When the user takes or retakes the quiz, we update both. Everyone who needs quiz data (SkinQuiz) looks at the whiteboard.

---

## 2.11 Possible Jury Questions

- **Where is the quiz result stored?**  
  In Redux (`state.user.quizResult`) and in localStorage under key `beautymatch_user`. No server.

- **Is there user login or profile?**  
  No. The app has no user authentication or profile. Only quiz results and recommendations are persisted.

---

# 3. Cart Feature Documentation

(You already have `docs/cart-system.md`. Here is a concise integration-focused summary.)

## 3.1 Overview

The **Cart** holds items the user wants to buy: product id, name, price, imageUrl, category, quantity. It is stored in **Redux** and **persisted in localStorage** so the cart survives refresh. A **sidebar** (CartSidebar) slides in from the right; the Navbar shows a cart icon with a badge count.

## 3.2 File Structure

```
src/
├── features/
│   └── cart/
│       ├── cartSlice.js      # items, totalQuantity, totalPrice, isOpen; reducers call cartUtils
│       ├── cartSelectors.js  # selectCartItems, selectCartQuantity, selectCartTotal, etc.
│       ├── cartUtils.js      # loadCartFromStorage, saveCartToStorage, clearCartStorage
│       └── CartItem.jsx      # One row in sidebar: image, name, price, +/- , remove
├── components/
│   └── cart/
│       └── CartSidebar.jsx   # Drawer: overlay, header, list of CartItem, footer with total + checkout
├── routes/
│   └── UserRoutes.jsx        # Renders CartSidebar so it’s on every user page
└── components/layout/
    └── Navbar.jsx           # Cart icon + badge, dispatch(openCart) on click
```

## 3.3 Data Flow

**Add to cart (e.g. from ProductCard):**

```
User clicks “Add to Cart”
   ↓
dispatch(addToCart({ id, name, price, imageUrl, category }))
   ↓
cartSlice.addToCart reducer: find existing item by id → increase quantity or push new item
   ↓
calculateTotals(items) → totalQuantity, totalPrice
   ↓
saveCartToStorage(state) → localStorage
   ↓
Components using selectCartItems / selectCartQuantity re-render (sidebar, badge)
```

**On app load:**  
`cartSlice` initial state is `loadCartFromStorage() || default`. So the first time the reducer runs, state is already hydrated from localStorage (items, totals; `isOpen` is forced false).

## 3.4 Redux Slice (cartSlice.js)

- **State:** `items[]`, `totalQuantity`, `totalPrice`, `isOpen`.
- **Reducers:** `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `updateQuantity`, `clearCart`, `openCart`, `closeCart`, `toggleCart`. Each mutation recalculates totals and (except open/close/toggle) calls `saveCartToStorage(state)`.
- **No thunks:** All sync. Persistence is inside the reducer via cartUtils.

## 3.5 Selectors (cartSelectors.js)

- **selectCartItems** — `state.cart.items`
- **selectCartQuantity** — `state.cart.totalQuantity`
- **selectCartTotal** — `state.cart.totalPrice`
- **selectCartIsOpen** — `state.cart.isOpen`
- **selectCartIsEmpty** — `state.cart.items.length === 0`
- **selectIsInCart(state, productId)** — whether that product is in items
- **selectItemQuantity(state, productId)** — quantity for that product (0 if not in cart)

Used by CartSidebar, Navbar, ProductCard, ProductDetails, Checkout, SkinQuiz so they all stay in sync.

## 3.6 API Layer

There is no cart API. `cartUtils.js` is the “persistence layer”: `loadCartFromStorage`, `saveCartToStorage`, `clearCartStorage`.

## 3.7 Component Breakdown

- **CartSidebar:** Uses selectors for isOpen, items, totalPrice, totalQuantity, isEmpty. Handlers: closeCart, overlay click → closeCart, clearCart, navigate to /checkout (and close), “Continue Shopping” → close + navigate to catalogue. Renders CartItem for each item.
- **CartItem:** Props: `item`. Dispatches increaseQuantity, decreaseQuantity, removeFromCart. Shows image, name, unit price, quantity controls, line total, remove button.
- **Navbar:** Reads selectCartQuantity; button dispatches openCart; badge shows count.

## 3.8 Possible Jury Questions

- **Where is the cart stored?**  
  Redux `state.cart` and localStorage key `beautyMatch_cart` (items, totalQuantity, totalPrice; not isOpen).

- **Why Redux for cart?**  
  So any page can add to cart or show the count without prop drilling, and the sidebar is always in sync.

- **Why localStorage?**  
  So the cart survives refresh and feels like a real shopping cart without a backend.

---

# 4. Orders, Checkout, n8n & AI Integration Documentation

## 4.1 Overview

- **Orders:** There is **no Redux orders slice**. Orders are created and read via **ordersAPI.js** (MockAPI). Checkout creates an order and then sends it to **n8n** for confirmation email (and optional MockAPI update).
- **Checkout:** Reads cart from Redux; user fills shipping form; on confirm: create order → send to n8n → clear cart and show success.
- **AI:** Skin quiz result is analyzed with **analyzeQuizResult.js** (rule-based). Recommendations come from **aiRecommendation.js**: if `VITE_GEMINI_API_KEY` is set, it uses **Google Gemini**; otherwise **Smart Matching** (local scoring). **aiPrompt.js** builds the Gemini prompt.

## 4.2 File Structure

```
src/
├── features/
│   └── orders/
│       └── ordersAPI.js       # getOrders, createOrder, updateOrder (MockAPI)
├── services/
│   ├── n8nService.js         # sendOrderToN8n(orderData) → webhook
│   └── aiRecommendation.js   # getRecommendations(quizResult, products); isAIAvailable, getAIProvider
├── lib/
│   └── aiPrompt.js           # buildRecommendationPrompt, getSystemMessage (Gemini)
├── utils/
│   └── analyzeQuizResult.js  # analyzeAnswers(answers), formatQuizResult, mapSkinTypeToFrench, etc.
├── pages/
│   └── User/
│       └── Checkout.jsx      # Form, order summary, createOrder + n8n, clearCart
└── pages/
    └── Admin/
        └── Orders.jsx        # getOrders(), table, search, pagination, updateOrder (e.g. emailSent)
```

## 4.3 Data Flow (Checkout)

```
User fills shipping form and clicks “Confirm Order”
   ↓
validateForm(); if cart empty → redirect or toast
   ↓
Build orderPayload: userName, userEmail, items (from cart), total
   ↓
ordersAPI.createOrder(orderPayload) → MockAPI POST → returns created order with id
   ↓
n8nService.sendOrderToN8n({ id, userName, userEmail, items, total })
   ↓
If n8n success (or 2xx): setIsConfirmed(true); setTimeout → dispatch(clearCart()); toast success
   ↓
If n8n fails: showToast error, leave cart; order already saved in MockAPI
```

## 4.4 API / Services

**ordersAPI.js**

- **getOrders()** — GET MockAPI orders URL. Returns array.
- **createOrder(order)** — POST; body: userName, userEmail, items, total, emailSent: false. Returns created order (with id).
- **updateOrder(orderId, updates)** — PATCH MockAPI orders URL + `/${orderId}`. Used e.g. to set `emailSent: true` after n8n sends the email.

**n8nService.js**

- **sendOrderToN8n(orderData)** — POST to `VITE_N8N_ORDER_WEBHOOK_URL` with `{ id, userName, userEmail, items, total }`. Returns `{ success, error? }`. If URL is missing, returns error. Any 2xx is treated as success so checkout can complete even if the workflow doesn’t return JSON.

**aiRecommendation.js**

- **getRecommendations(quizResult, products)** — If Gemini key exists, calls Gemini with prompt from aiPrompt; parses JSON from response. If no key or Gemini fails, falls back to `generateSmartRecommendations` (score products by skin type/concerns/ingredients, pick best per category). Returns `{ routine: { cleanser, serum, moisturizer, sunscreen }, summary }`.
- **isAIAvailable()** — true if Gemini key is set.
- **getAIProvider()** — `'Google Gemini'` or `'Smart Matching'`.

**aiPrompt.js**

- **buildRecommendationPrompt(quizResult, products)** — Builds text: user skin profile + product list + instructions + required JSON format for routine + summary.
- **getSystemMessage()** — Short “you are an expert skincare consultant” system message for Gemini.

**analyzeQuizResult.js**

- **analyzeAnswers(answers)** — Score-based: each answer adds points to skin types (dry, oily, combination, sensitive, normal); picks highest; maps concerns and age range from answer indices. Returns `{ skinType, concerns, ageRange }`.
- **formatQuizResult**, **mapSkinTypeToFrench**, **mapConcernsToFrench** — Helpers for display and for aiPrompt.

## 4.5 How State Updates Re-render UI (Checkout)

- Checkout uses `useSelector(selectCartItems)` and `selectCartTotal`. When cart is cleared after success, those selectors return empty/0 and the component can show the success view (or redirect).
- `isConfirmed` is local state; when set true, the same component re-renders and shows the “Order Confirmed!” block instead of the form.

## 4.6 Architecture: Where n8n and AI Fit

- **n8n:** External automation. Checkout sends order payload to a webhook. The n8n workflow can send a confirmation email and/or call MockAPI to set `emailSent`. The front-end only POSTs and checks success/error; it doesn’t know the workflow steps.
- **AI:** Quiz answers → analyzeQuizResult (client) → getRecommendations (client) → either Gemini (network) or Smart Matching (local). Result is saved to user (Redux + localStorage) and displayed on SkinQuiz. So “AI” is either a remote API (Gemini) or a local scoring function; the rest of the app just consumes `{ routine, summary }`.

---

# 5. Admin Feature Documentation

## 5.1 Overview

**Admin** is separate from the user profile: it uses its own **session** in localStorage (`adminAuth.js`). Admin login is a simple username/password check (hardcoded for demo). Once “logged in,” the admin can access Dashboard, ManageProducts, addProduct, and Orders. **AdminRoutes** checks `isAdminLoggedIn()` and redirects to `/admin-login` if not.

## 5.2 File Structure

```
src/
├── utils/
│   └── adminAuth.js         # validateAdminCredentials, setAdminSession, clearAdminSession, isAdminLoggedIn
├── routes/
│   └── AdminRoutes.jsx      # If !isAdminLoggedIn() → Navigate to /admin-login; else AdminSidebar + Outlet
├── pages/
│   └── Admin/
│       ├── AdminLogin.jsx   # Form → validateAdminCredentials → setAdminSession → navigate /Dashboard
│       ├── Dashboard.jsx    # Dashboard widgets
│       ├── ManageProducts.jsx # Products table, delete/update modals, ProductFilters
│       ├── addProduct.jsx  # Form → createProduct thunk
│       └── Orders.jsx      # getOrders(), table, pagination, updateOrder
├── components/
│   └── layout/
│       └── AdminSidebar.jsx # Links to Dashboard, Manage, Add Product, Orders, Logout (clearAdminSession)
```

## 5.3 Data Flow

- **Admin login:** User enters username/password → `validateAdminCredentials` → if ok, `setAdminSession()` (localStorage key `beautymatch_admin_session` = 'true') → navigate to `/Dashboard`. No Redux.
- **Protected routes:** AdminRoutes renders; if `isAdminLoggedIn()` is false, render `<Navigate to="/admin-login" />`; else render AdminSidebar + Outlet (Dashboard, ManageProducts, etc.).
- **Admin logout:** AdminSidebar (or similar) calls `clearAdminSession()` and navigates to admin-login or home. Again no Redux; only localStorage.

## 5.4 Why Separate from User?

So that “shopper profile” (name, email, quiz) and “admin access” are independent. Admin access is independent of shopper quiz data.

---

# 6. Routing & App Bootstrap Documentation

## 6.1 Overview

- **main.jsx:** Renders the app inside `Provider` (Redux) and `ToastProvider` (context for toasts). So the whole app has access to the store and to `useToast()`.
- **App.jsx:** Uses React Router: `BrowserRouter`, `Routes`, `Route`. Defines `/admin-login`, user routes under `UserRoutes` (Navbar + Outlet + Footer + CartSidebar), and admin routes under `AdminRoutes` (AdminSidebar + Outlet). On mount it runs `dispatch(loadUserFromStorage())` so user state is restored.
- **UserRoutes.jsx:** Layout: Navbar, main (Outlet), Footer, CartSidebar. So every user page (/, /catalogue, /products/:id, /skin-quiz, /checkout) shares the same shell and cart.
- **AdminRoutes.jsx:** Guard: if not admin, redirect to /admin-login; else layout with AdminSidebar and Outlet.

## 6.2 Route Table

| Path | Layout | Page |
|------|--------|------|
| /admin-login | None | AdminLogin |
| / | UserRoutes | Home |
| /catalogue | UserRoutes | Catalogue |
| /products/:id | UserRoutes | ProductDetails |
| /recommendation | UserRoutes | Recommendation (file may be missing; route exists in App.jsx) |
| /skin-quiz | UserRoutes | SkinQuiz |
| /checkout | UserRoutes | Checkout |
| /manage | AdminRoutes | ManageProducts |
| /Dashboard | AdminRoutes | Dashboard |
| /addProduct | AdminRoutes | addProduct |
| /orders | AdminRoutes | Orders |

**Recommendation route:** `App.jsx` defines `/recommendation` and imports `Recommendation` from `./pages/User/Recommendation`. In the current repo there is no `Recommendation.jsx` in `pages/User/` (only Catalogue, Checkout, Home, ProductDetails, SkinQuiz, Cart). So that route will fail at runtime unless you:

- **Option A:** Add a `Recommendation.jsx` page that reads `selectRecommendations` and `productsData` from Redux and renders the same routine cards as SkinQuiz results.
- **Option B:** Remove the route and the import from `App.jsx`.

Recommendations are displayed on the **Skin Quiz results screen**, so the route is optional.

---

# 7. Skin Quiz & AI Recommendations Feature Documentation

## 7.1 Overview

The **Skin Quiz** is a 5-question flow that determines the user’s skin type (dry, oily, combination, sensitive, normal), concerns, and age range. The result is **analyzed in the browser** (no AI). Then **recommendations** are generated: either by **Google Gemini** (if `VITE_GEMINI_API_KEY` is set) or by **Smart Matching** (local scoring). The result and recommendations are saved to the **user** slice and localStorage.

**In simple words:** User answers 5 questions → we compute skin type with points → we ask “which products fit?” either to Gemini or to a local scoring function → we show a 4-step routine (cleanser, serum, moisturizer, sunscreen) and a summary, and we save that so SkinQuiz and future visits can show it.

## 7.2 File Structure

```
src/
├── pages/User/
│   └── SkinQuiz.jsx              # Route entry: Redux, state, effects, handlers; renders subcomponents by viewMode
├── components/quiz/
│   ├── QuizComponents.jsx        # ProgressBar, QuestionCard, QuizButton
│   └── SkinQuiz/                 # UI-only subcomponents
│       ├── IntroScreen.jsx       # Intro + Start button
│       ├── QuizScreen.jsx        # Questions, answers, Back/Next
│       ├── LoadingScreen.jsx     # Loading state
│       ├── ErrorScreen.jsx       # Error + Try Again
│       ├── ResultsScreen.jsx     # Skin type, AI summary, routine cards
│       └── RecommendedProductCard.jsx  # Product card with Add to Cart
├── data/
│   └── skinQuizData.js           # quizQuestions, skinTypeInfo, routineSteps
├── utils/
│   └── analyzeQuizResult.js      # analyzeAnswers, formatQuizResult, mapSkinTypeToFrench, mapConcernsToFrench
├── services/
│   └── aiRecommendation.js       # getRecommendations, callGemini, generateSmartRecommendations
├── lib/
│   └── aiPrompt.js               # buildRecommendationPrompt, getSystemMessage
├── features/
│   ├── user/                     # saveQuizResultThunk, saveRecommendationsThunk, clearQuizDataThunk
│   └── products/                 # fetchProducts so we have products to recommend
```

## 7.3 Architecture Relation

- **SkinQuiz.jsx** — Route entry page; holds all logic. Uses products slice (fetchProducts, productsData), user slice (selectQuizResult, selectRecommendations), user thunks (saveQuizResultThunk, saveRecommendationsThunk, clearQuizDataThunk), analyzeQuizResult.analyzeAnswers, aiRecommendation.getRecommendations. Renders IntroScreen, QuizScreen, LoadingScreen, ErrorScreen, ResultsScreen based on viewMode.
- **SkinQuiz subcomponents** — UI-only, receive props from SkinQuiz.jsx. ResultsScreen uses RecommendedProductCard (which uses cart for Add to Cart).
- **QuizComponents.jsx** — Presentational: progress bar, question card, buttons. No Redux.
- **skinQuizData.js** — Static data: quiz questions, skin type display info, routine step labels.
- **analyzeQuizResult.js** — Pure functions: answers (array of indices) → skin type, concerns, age range. Used only by SkinQuiz and (for French labels) aiPrompt.
- **aiRecommendation.js** — getRecommendations(quizResult, products) is the only entry point; decides Gemini vs Smart Matching; returns { routine, summary }.
- **aiPrompt.js** — Used only when Gemini is used; builds the prompt and system message.

## 7.4 Data Flow

**User completes last question and clicks “Get My Routine”:**

```
handleNext() on last step
   ↓
setIsLoading(true); analyzeAnswers(answers) → quizResult
   ↓
dispatch(saveQuizResultThunk(quizResult))
   ↓
Ensure products: if empty, dispatch(fetchProducts()) and wait
   ↓
getRecommendations(quizResult, products) — async
   ↓
  If VITE_GEMINI_API_KEY: buildRecommendationPrompt + getSystemMessage → fetch Gemini → parse JSON
  Else or on error: generateSmartRecommendations(quizResult, products)
   ↓
setRecommendations(recs); dispatch(saveRecommendationsThunk(recs))
   ↓
setViewMode('results'); setIsLoading(false)
   ↓
Results screen: skin type, summary, routine cards (with product details from productsData), Add to Cart
```

## 7.5 Redux Relation

- **User slice** holds quizResult and recommendations; thunks save them to localStorage and the slice updates on fulfilled. No dedicated “quiz” slice; quiz state is “user’s saved analysis.”
- **Products slice** is used so we have a product list to score (Smart Matching) or send to Gemini, and so we can show name, price, image, and “Add to Cart” for each recommended product.

## 7.6 Logic Explanation

- **When the page loads:** If the user already has saved quizResult and recommendations, SkinQuiz shows the results view immediately (useEffect sets viewMode and local state from Redux).
- **When the user answers and clicks “Get My Routine”:** We analyze answers locally, save quiz result, fetch products if needed, call getRecommendations (Gemini or Smart Matching), then save recommendations (Redux + localStorage) and show the results.
- **When the user clicks “Add to Cart” on a recommendation:** Same as anywhere else: dispatch(addToCart(...)), optional openCart, toast. Cart and products state are unchanged; only cart slice updates.
- **When the user clicks “Retake Quiz”:** dispatch(clearQuizDataThunk()); reset local state (step, answers, quizResult, recommendations, viewMode) so the quiz starts over.

## 7.7 Possible Jury Questions

- **Where is the quiz result stored?**  
  In Redux `state.user.quizResult` and in localStorage under key `beautymatch_user`.

- **How does “AI” work?**  
  If you set `VITE_GEMINI_API_KEY`, we send the skin profile and product list to Google Gemini and ask for a JSON routine + summary. If you don’t set it (or Gemini fails), we use Smart Matching: we score each product by skin type and concerns and pick the best per category. Both paths return the same shape: { routine: { cleanser, serum, moisturizer, sunscreen }, summary }.

- **Why both Gemini and Smart Matching?**  
  So the app works without an API key (e.g. demo, offline) and still gives personalized recommendations; with a key, the user gets Gemini-generated explanations.

---

# 8. Toast & Shared UI Documentation

## 8.1 Overview

The **Toast** is a global notification system: any component can show a short success or error message at the bottom-right of the screen. It uses **React Context** (not Redux), so there is no slice or thunk—only a provider and a hook.

**In simple words:** When something good or bad happens (e.g. “Product added to cart”, “Order confirmed”, “Please fill required fields”), the component calls `showToast(message, 'success' | 'error')`. A small box appears for a few seconds, then disappears.

## 8.2 File Structure

```
src/
├── main.jsx              # Wraps App with <ToastProvider>
├── components/
│   └── Toast.jsx         # ToastProvider, useToast(), toast UI
```

## 8.3 How It Connects

- **main.jsx** — Renders `<ToastProvider><App /></ToastProvider>`. Every page and component is inside the provider, so they can call `useToast()`.
- **Who uses it:** ProductCard, ProductDetails, SkinQuiz, Checkout, PopUpUpdate, popUpDelete, addProduct (success/error feedback).

## 8.4 Data Flow

```
Component calls showToast('Added to cart!', 'success')
   ↓
ToastProvider state: setToast({ message, type })
   ↓
Provider re-renders; toast div is visible (fixed bottom-right)
   ↓
setTimeout(3000) → setToast(null)
   ↓
Toast disappears
```

No Redux, no API. State is local to the provider (`useState(null)`). The hook `useToast()` returns `{ showToast }` so any child can trigger a toast.

## 8.5 Component Breakdown (Toast.jsx)

- **ToastProvider** — Holds `toast` (null or `{ message, type }`). Exposes `showToast(message, type)` that sets toast and clears it after 3 seconds. Renders `children` and, when `toast` is set, a fixed div with the message and a close button.
- **useToast()** — `useContext(ToastContext)`. Returns `{ showToast }`. Used in pages and components to show feedback.

## 8.6 Why Context Instead of Redux?

Toasts are ephemeral UI: they don’t need to be in the store, and only one toast is shown at a time. Context is enough and keeps the implementation simple. Redux is used for data that many parts of the app need to read and update (products, user, cart).

---

# 9. Global Architecture Overview

## 9.1 Overall Project Structure

```
beauty-match/
├── src/
│   ├── main.jsx              # Entry: Provider, ToastProvider, App
│   ├── App.jsx               # Router + routes; loadUserFromStorage on mount
│   ├── app/
│   │   └── store.js          # Redux: products, user, cart
│   ├── routes/
│   │   ├── UserRoutes.jsx    # Navbar, Outlet, Footer, CartSidebar
│   │   └── AdminRoutes.jsx   # Guard + AdminSidebar, Outlet
│   ├── features/             # Domain-based Redux + API
│   │   ├── products/         # productsSlice, productsThunks, productsAPI
│   │   ├── user/             # userSlice, userThunks, userAPI
│   │   ├── cart/             # cartSlice, cartSelectors, cartUtils, CartItem
│   │   └── orders/           # ordersAPI only (no slice)
│   ├── pages/
│   │   ├── User/             # Home, Catalogue, ProductDetails, SkinQuiz, Checkout
│   │   └── Admin/            # AdminLogin, Dashboard, ManageProducts, addProduct, Orders
│   ├── components/           # Layout, shop, cart, quiz (QuizComponents, SkinQuiz subcomponents), modals, Toast
│   ├── data/                 # skinQuizData (quiz questions, skin type info, routine steps)
│   ├── services/             # n8nService, aiRecommendation
│   ├── lib/                  # aiPrompt
│   └── utils/                # adminAuth, analyzeQuizResult
├── docs/
│   ├── ARCHITECTURE.md
│   ├── cart-system.md
│   └── TECHNICAL_DOCUMENTATION.md (this file)
└── ...
```

## 9.2 Folder Organization Rationale

- **features/** — One folder per “domain” (products, user, cart). Each can have slice, thunks, API, and small UI (e.g. CartItem). Orders are API-only because we don’t keep an orders list in Redux.
- **pages/** — One component per route; they compose components and dispatch thunks or call APIs.
- **components/** — Reusable UI: layout (Navbar, Footer, sidebars), shop (ProductCard, ProductGrid, filters), cart (CartSidebar), quiz (QuizComponents), modals (PopUpUpdate, popUpDelete), Toast.
- **services/** — External integrations: n8n webhook, AI recommendation (Gemini or smart matching).
- **lib/** — Pure helpers used by services (e.g. prompt building for Gemini).
- **utils/** — App-wide helpers: admin session, quiz analysis.

## 9.3 Why This Architecture

- **React** — UI as components; predictable rendering and lifecycle.
- **Redux Toolkit** — One store for products, user, cart; async with createAsyncThunk; Immer for simple reducer logic.
- **Axios** — HTTP for MockAPI (products, orders) and n8n; fetch used for Gemini in aiRecommendation.
- **React Router** — Declarative routes and layouts (UserRoutes vs AdminRoutes).
- **localStorage** — User and cart persistence without a backend; admin session for demo.

## 9.4 Full Data Lifecycle (UI → API and Back)

**Example: User adds product to cart and checks out**

1. **UI:** User clicks “Add to Cart” on ProductCard.
2. **Handler:** `dispatch(addToCart({ id, name, price, imageUrl, category }))`.
3. **Reducer:** cartSlice updates `items`, totals, and saves to localStorage.
4. **Re-render:** CartSidebar and Navbar badge update via selectors.
5. **Later:** User goes to Checkout, fills form, clicks “Confirm Order.”
6. **Checkout:** Reads cart (selectors) and form; calls `createOrder(orderPayload)` (ordersAPI → MockAPI).
7. **API:** MockAPI returns created order with id.
8. **n8n:** `sendOrderToN8n({ id, userName, userEmail, items, total })` POSTs to webhook.
9. **UI:** On success, `dispatch(clearCart())`, show success message; cart state and localStorage are cleared.
10. **Re-render:** Cart badge goes to 0; success view or redirect.

So: **UI event → dispatch or direct API call → backend/webhook → Redux or local state update → re-render.**

## 9.5 Where n8n and AI Sit in the Architecture

- **n8n:** After an order is created in MockAPI, the front-end sends the order payload to an n8n webhook URL. The workflow (outside this repo) can send emails, update MockAPI, etc. The app only cares about “did the POST succeed?” so it can clear the cart and show success.
- **AI:** The quiz runs in the browser; answers are analyzed locally (analyzeQuizResult). Recommendations are either:
  - **Gemini:** Front-end builds a prompt (aiPrompt), calls Gemini API (aiRecommendation), parses JSON, returns routine + summary.
  - **Smart Matching:** Same entry point (getRecommendations), but logic is local scoring and category matching; no network.
Result is stored in Redux + localStorage (user feature) and shown on SkinQuiz. So “AI” is a **service** consumed by the user flow; state lives in the user slice.

---

This completes the technical documentation. Use it together with `docs/ARCHITECTURE.md` and `docs/cart-system.md` for a full picture of the project.
