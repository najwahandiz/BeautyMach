# Beauty Match — Architecture & Presentation Guide

This document explains the project structure, data flow, and how to present or modify the app during your soutenance.

---

## 1. Tech stack

- **React** (functional components only)
- **Redux Toolkit** (slices + createAsyncThunk)
- **Axios** (HTTP: MockAPI for products/orders)
- **JavaScript**
- **Tailwind CSS**
- **React Router** (routes)

---

## 2. Folder structure (simplified)

```
src/
├── main.jsx              # Entry: Provider + ToastProvider + App
├── App.jsx               # Router + routes; on mount loads user from localStorage
├── app/
│   └── store.js          # Redux store (products, user, cart)
├── routes/
│   ├── UserRoutes.jsx    # Layout: Navbar, Outlet, Footer, CartSidebar
│   └── AdminRoutes.jsx   # Protected layout: AdminSidebar, Outlet (redirects to /admin-login if not admin)
├── features/             # Redux state by domain
│   ├── products/         # Products list (CRUD)
│   │   ├── productsSlice.js   # State: productsData, loading, error, success
│   │   ├── productsThunks.js # fetchProducts, createProduct, updateProduct, deleteProduct
│   │   └── productsAPI.js    # Axios calls to MockAPI
│   ├── user/             # User profile, quiz, recommendations
│   │   ├── userSlice.js      # State: profile, quizResult, recommendations, loading, error
│   │   ├── userThunks.js     # loginUser, loadUserFromStorage, logoutUser, saveQuizResultThunk, etc.
│   │   └── userAPI.js        # localStorage (no HTTP)
│   ├── cart/
│   │   ├── cartSlice.js      # State: items, totalQuantity, totalPrice, isOpen
│   │   ├── cartSelectors.js  # selectCartItems, selectCartTotal, etc.
│   │   ├── cartUtils.js      # localStorage persistence
│   │   └── CartItem.jsx       # One line in cart sidebar
│   └── orders/
│       └── ordersAPI.js      # MockAPI for orders (no slice; used by Checkout & Admin Orders)
├── pages/
│   ├── User/             # Home, Catalogue, ProductDetails, SkinQuiz, Recommendation, Profile, Checkout
│   └── Admin/            # AdminLogin, Dashboard, ManageProducts, addProduct, Orders
├── components/
│   ├── layout/           # Navbar, Footer, AdminSidebar, HeroImageSlider
│   ├── shop/             # ProductCard, ProductGrid, FiltersSidebar, SearchBar, SortSelect
│   ├── cart/             # CartSidebar
│   ├── quiz/             # QuizComponents (ProgressBar, QuestionCard, QuizButton)
│   ├── Toast.jsx         # useToast() for success/error messages
│   ├── PopUpUpdate.jsx   # Admin: edit product modal
│   ├── popUpDelete.jsx   # Admin: delete product confirmation
│   └── DashboardComponents.jsx  # Admin dashboard widgets
├── services/
│   ├── n8nService.js     # POST order to n8n webhook (checkout)
│   └── aiRecommendation.js # AI recommendations (Gemini or local logic)
├── lib/
│   └── aiPrompt.js       # Builds prompt for Gemini
└── utils/
    ├── adminAuth.js      # Admin login (localStorage session)
    └── analyzeQuizResult.js # Quiz answers → skinType, concerns, ageRange
```

---

## 3. Data flow (Component → Redux → API → Redux → Component)

### Example: Loading products on the Catalogue page

1. **Component**  
   `Catalogue.jsx` runs `useEffect` and dispatches:  
   `dispatch(fetchProducts())`

2. **Thunk**  
   `productsThunks.js` → `fetchProducts`:  
   - Sets `loading: true` (via slice `pending`).  
   - Calls `getProducts()` from `productsAPI.js` (Axios GET).

3. **API**  
   `productsAPI.js` → `getProducts()`:  
   - `axios.get(MockAPI_URL)` → returns product list or throws.

4. **Back to Redux**  
   - If OK: thunk returns data → slice `fulfilled` → `state.products.productsData = action.payload`, `loading = false`.  
   - If error: thunk returns `rejectWithValue(message)` → slice `rejected` → `state.products.error = action.payload`, `loading = false`.

5. **Component**  
   `Catalogue` uses `useSelector(state => state.products)`:  
   - Gets `productsData`, `loading`, `error`.  
   - Renders list or error/retry. Filtering/sorting is done in the component (e.g. `filterAndSortProducts(productsData, filters)`).

### Same pattern for other async actions

- **User:** `dispatch(loginUser(profile))` → `userThunks.loginUser` → `userAPI.saveUser` (localStorage) → `userSlice` updates `profile`, `quizResult`, `recommendations`.
- **Cart:** No thunks. Components `dispatch(addToCart(...))` or `dispatch(removeFromCart(id))` → `cartSlice` reducers update `items` and call `cartUtils.saveCartToStorage`.
- **Orders:** Checkout and Admin Orders call `ordersAPI.getOrders`, `createOrder`, `updateOrder` directly (no Redux orders slice). Checkout also calls `n8nService.sendOrderToN8n()`.

---

## 4. Link between components and functions

| Page / Component        | Redux slice(s)     | Thunks / actions used                                      | API / services                    |
|-------------------------|--------------------|------------------------------------------------------------|-----------------------------------|
| **Catalogue**           | products           | fetchProducts                                             | productsAPI.getProducts           |
| **ProductDetails**     | cart               | addToCart, openCart                                       | —                                 |
| **ProductCard** (shop)  | cart               | addToCart, openCart                                       | —                                 |
| **CartSidebar**        | cart               | closeCart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart | —                        |
| **SkinQuiz**           | user               | saveQuizResultThunk, saveRecommendationsThunk, loginUser   | userAPI, aiRecommendation, aiPrompt |
| **Recommendation**     | user               | (reads recommendations)                                   | —                                 |
| **Profile**            | user, cart         | loginUser, logoutUser, updateUserProfileThunk, clearQuizDataThunk, addToCart, openCart | userAPI |
| **Checkout**           | user, cart         | (reads profile, items); clearCart after success            | ordersAPI, n8nService             |
| **ManageProducts**     | products           | fetchProducts, deleteProduct, updateProduct                | productsAPI                       |
| **PopUpUpdate**        | products           | updateProduct                                             | productsAPI.updateProduct         |
| **popUpDelete**        | products           | deleteProduct                                             | productsAPI.deleteProduct         |
| **addProduct**         | products           | createProduct                                             | productsAPI.addProduct            |
| **Orders** (admin)     | —                  | —                                                         | ordersAPI.getOrders, updateOrder  |
| **AdminLogin**         | —                  | —                                                         | utils/adminAuth                   |
| **App**                | user               | loadUserFromStorage (on mount)                            | userAPI.loadUser                  |

---

## 5. Why this version is good for a beginner presentation

1. **One place per concern**  
   - Products: `productsSlice` (state) + `productsThunks` (async) + `productsAPI` (HTTP).  
   - Same for user and cart. Easy to say: "To change how products load, I go to productsThunks and productsAPI."

2. **Clear data flow**  
   - Always: **Component** → **dispatch(thunk or action)** → **thunk calls API** → **slice updates state** → **component re-renders via useSelector**.  
   - You can draw this on the board and point to the same chain for products, user, and cart.

3. **Easy to change live**  
   - **Change a label or message:** in the component (e.g. Catalogue, ProductCard, Toast).  
   - **Change filter/sort logic:** in `Catalogue.jsx`, function `filterAndSortProducts`.  
   - **Change product fields:** in `productsAPI` and the slice if needed; components use `product.name`, `product.price`, etc.  
   - **Add a new action:** add a reducer in the slice and a `dispatch(action)` in the component.

4. **No extra layers**  
   - No custom hooks for data (only `useToast` for notifications).  
   - No complex middleware.  
   - Selectors are simple (e.g. `state => state.cart.items` or small helpers in `cartSelectors.js`).

5. **Comments**  
   - Short comments at the top of slices, thunks, APIs, and main components explain their role so you can quickly remind yourself during the demo.

---

## 6. Quick reference for the jury

- **"Where is the product list stored?"**  
  Redux: `state.products.productsData`. Loaded by `fetchProducts` thunk from `productsAPI` (MockAPI).

- **"Where is the cart?"**  
  Redux: `state.cart.items`. Persisted in `localStorage` via `cartUtils`; updated by `cartSlice` (addToCart, removeFromCart, etc.).

- **"Where is the user profile?"**  
  Redux: `state.user.profile`. Persisted in `localStorage` via `userAPI`; login/logout via `userThunks` and `userSlice`.

- **"How does checkout work?"**  
  Checkout page reads cart and profile from Redux, calls `ordersAPI.createOrder`, then `n8nService.sendOrderToN8n`, then dispatches `clearCart()` and shows success.

- **"Where do I change the catalogue filters?"**  
  In `src/pages/User/Catalogue.jsx`, function `filterAndSortProducts(products, filters)`.

---

## 7. Unused files (documented)

- **`src/components/shop/ShopProductCard.jsx`** and **`src/components/shop/ShopFilters.jsx`** are not used. The app uses **ProductCard**, **ProductGrid**, and **FiltersSidebar** (see `src/components/shop/README.md`). You can delete the two unused files to simplify, or keep them as alternatives.
