# Cart System Documentation

## Overview

The BeautyMatch cart system is a complete sidebar cart implementation using **Redux Toolkit** for state management and **localStorage** for persistence. The cart slides in from the right side of the screen and works across all pages.

---

## File Structure

```
src/
├── features/cart/
│   ├── cartSlice.js      # Redux state & reducers
│   ├── cartSelectors.js  # Selector functions
│   ├── cartUtils.js      # localStorage helpers
│   └── CartItem.jsx      # Individual item component
│
├── components/cart/
│   └── CartSidebar.jsx   # Main sidebar drawer
│
└── components/layout/
    └── Navbar.jsx        # Cart icon with badge
```

---

## How It Works

### 1. State Flow

```
User clicks "Add to Cart"
        ↓
dispatch(addToCart(product))
        ↓
Redux updates state
        ↓
saveCartToStorage() saves to localStorage
        ↓
Components re-render with new data
```

### 2. On App Start

```
App loads
    ↓
cartSlice initializes
    ↓
loadCartFromStorage() checks localStorage
    ↓
If cart exists → Load it
If not → Use empty cart
```

---

## Redux State Structure

```javascript
{
  items: [
    {
      id: "abc123",        // Product ID
      name: "Rose Serum",  // Product name
      price: 299,          // Price in MAD
      imageUrl: "/...",    // Product image
      category: "serum",   // Product category
      quantity: 2          // How many
    }
  ],
  totalQuantity: 2,        // Sum of all quantities
  totalPrice: 598,         // Sum of (price × quantity)
  isOpen: false            // Sidebar open/closed
}
```

---

## Available Actions

| Action | Description | Usage |
|--------|-------------|-------|
| `addToCart` | Add product or increase quantity | `dispatch(addToCart({ id, name, price, imageUrl }))` |
| `removeFromCart` | Remove item completely | `dispatch(removeFromCart(productId))` |
| `increaseQuantity` | Add 1 to quantity | `dispatch(increaseQuantity(productId))` |
| `decreaseQuantity` | Subtract 1 (min = 1) | `dispatch(decreaseQuantity(productId))` |
| `updateQuantity` | Set specific quantity | `dispatch(updateQuantity({ id, quantity }))` |
| `clearCart` | Empty the cart | `dispatch(clearCart())` |
| `openCart` | Open sidebar | `dispatch(openCart())` |
| `closeCart` | Close sidebar | `dispatch(closeCart())` |
| `toggleCart` | Toggle sidebar | `dispatch(toggleCart())` |

---

## Available Selectors

| Selector | Returns | Usage |
|----------|---------|-------|
| `selectCartItems` | Array of items | `useSelector(selectCartItems)` |
| `selectCartQuantity` | Total item count | `useSelector(selectCartQuantity)` |
| `selectCartTotal` | Total price | `useSelector(selectCartTotal)` |
| `selectCartIsOpen` | Boolean | `useSelector(selectCartIsOpen)` |
| `selectCartIsEmpty` | Boolean | `useSelector(selectCartIsEmpty)` |
| `selectIsInCart` | Boolean | `useSelector(state => selectIsInCart(state, id))` |
| `selectItemQuantity` | Number | `useSelector(state => selectItemQuantity(state, id))` |

---

## localStorage Sync

### Key Used
```javascript
const CART_STORAGE_KEY = 'beautyMatch_cart';
```

### What Gets Saved
- `items` array
- `totalQuantity`
- `totalPrice`

### What Doesn't Get Saved
- `isOpen` (sidebar state) - Always starts closed

### Helper Functions

```javascript
// Load cart from localStorage
loadCartFromStorage() → Object | null

// Save cart to localStorage
saveCartToStorage(cartState) → void

// Clear cart from localStorage
clearCartStorage() → void
```

---

## UI Components

### CartSidebar.jsx

The main cart drawer component.

**Features:**
- Slides in from right
- Dark overlay backdrop
- Scrollable items list
- Sticky footer with total
- Empty cart state
- Close on overlay click
- Close button

**States:**
- Open/Closed (controlled by Redux `isOpen`)
- Empty/Has items

### CartItem.jsx

Individual cart item row.

**Shows:**
- Product image
- Product name
- Unit price
- Quantity controls (+/−)
- Item total
- Remove button (trash icon)

**Interactions:**
- Increase quantity
- Decrease quantity (min 1)
- Remove item

### Navbar Cart Button

**Features:**
- Shopping bag icon
- Badge showing item count
- Opens cart on click
- Badge animates when count changes

---

## Adding Products to Cart

### From a Product Card

```jsx
import { useDispatch } from 'react-redux';
import { addToCart, openCart } from '../features/cart/cartSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category
    }));
    
    // Optionally open cart after adding
    dispatch(openCart());
  };
  
  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### From Product Details Page

```jsx
const handleAddToCart = () => {
  dispatch(addToCart({
    id: product._id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl
  }));
  dispatch(openCart());
};
```

---

## Design System

### Colors Used

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#9E3B3B` | Buttons, accents |
| Secondary | `rgb(234, 123, 123)` | Icons, highlights |
| Accent | `#fff0eb` | Button backgrounds |
| Background | `#fffbf9` | Sidebar gradient |
| Border | `#f5e6e0` | Item borders |

### Animations

- **Slide-in**: 300ms ease-out transition
- **Fade-in**: Overlay backdrop
- **Scale-in**: Badge appearance
- **Hover lift**: -translate-y on buttons

---

## Responsive Behavior

### Desktop
- Sidebar: max-width 448px (max-w-md)
- Cart button in navbar with badge

### Mobile
- Sidebar: full width on small screens
- Separate cart button in mobile header
- Touch-friendly buttons

---

## Tips for Jury Presentation

1. **Why Redux?** 
   - Global state accessible from any component
   - Predictable state updates
   - Easy debugging with Redux DevTools

2. **Why localStorage?**
   - Cart persists after refresh
   - No server needed
   - Works offline

3. **Why Sidebar?**
   - Users stay on page while viewing cart
   - Quick add/remove without navigation
   - Better UX than separate cart page

4. **Key Code Concepts:**
   - Immer (built into Redux Toolkit) allows "mutating" state safely
   - Selectors keep components clean
   - Reducers handle all business logic

