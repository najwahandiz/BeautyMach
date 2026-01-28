/**
 * CartSidebar.jsx
 * 
 * Slide-in cart drawer that appears from the right side.
 * Shows all cart items, total price, and checkout button.
 * 
 * Features:
 * - Smooth slide-in/slide-out animation
 * - Overlay backdrop that closes cart on click
 * - Scrollable items list
 * - Sticky footer with total and checkout
 * - Empty cart state with elegant message
 */

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Sparkles } from 'lucide-react';
import { closeCart, clearCart } from '../../features/cart/cartSlice';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartQuantity, 
  selectCartIsOpen,
  selectCartIsEmpty 
} from '../../features/cart/cartSelectors';
import { formatPrice } from '../../features/cart/cartUtils';
import CartItem from '../../features/cart/CartItem';

export default function CartSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get cart state from Redux
  const isOpen = useSelector(selectCartIsOpen);
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const totalQuantity = useSelector(selectCartQuantity);
  const isEmpty = useSelector(selectCartIsEmpty);
  
  // ===== EVENT HANDLERS =====
  
  const handleClose = () => {
    dispatch(closeCart());
  };
  
  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay itself, not the sidebar
    if (e.target === e.currentTarget) {
      dispatch(closeCart());
    }
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };
  
  const handleContinueShopping = () => {
    dispatch(closeCart());
    navigate('/catalogue');
  };
  
  return (
    <>
      {/* ===== OVERLAY BACKDROP ===== */}
      <div 
        onClick={handleOverlayClick}
        className={`
          fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden={!isOpen}
      />
      
      {/* ===== SIDEBAR DRAWER ===== */}
      <aside
        className={`
          fixed top-0 right-0 z-[70] h-full w-full max-w-md
          bg-gradient-to-b from-[#fffbf9] to-white
          shadow-2xl shadow-black/10
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        
        {/* ===== HEADER ===== */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-[#f5e6e0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9E3B3B] to-[#c45858] flex items-center justify-center shadow-lg shadow-[#9E3B3B]/20">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-serif">
                Your Cart
              </h2>
              <p className="text-sm text-gray-500">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-500 hover:text-[#9E3B3B] hover:bg-[#9E3B3B]/5 transition-all duration-200"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </header>
        
        {/* ===== CART CONTENT ===== */}
        <div className="flex-1 overflow-y-auto">
          
          {isEmpty ? (
            /* ===== EMPTY CART STATE ===== */
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              
              {/* Decorative Icon */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fff0eb] to-[#ffeee8] flex items-center justify-center">
                  <ShoppingBag size={40} className="text-[#ea7b7b]" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Sparkles size={16} className="text-[#9E3B3B]" />
                </div>
              </div>
              
              {/* Message */}
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-8 max-w-[240px]">
                Discover our curated collection of premium skincare products
              </p>
              
              {/* CTA Button */}
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#9E3B3B]/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* ===== CART ITEMS LIST ===== */
            <div className="px-4 py-4 space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              
              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="w-full py-2.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 mt-4"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
        
        {/* ===== FOOTER (only if cart has items) ===== */}
        {!isEmpty && (
          <footer className="border-t border-[#f5e6e0] bg-white px-6 py-5">
            
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(totalPrice)}
              </span>
            </div>
            
            {/* Info Text */}
            <p className="text-xs text-gray-500 mb-4 text-center">
              Shipping and taxes calculated at checkout
            </p>
            
            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#9E3B3B]/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] mb-3"
            >
              Proceed to Checkout
            </button>
            
            {/* Continue Shopping Link */}
            <button
              onClick={handleContinueShopping}
              className="w-full py-3 text-[#9E3B3B] font-medium hover:bg-[#9E3B3B]/5 rounded-xl transition-all duration-200"
            >
              Continue Shopping
            </button>
          </footer>
        )}
      </aside>
      
      {/* ===== CUSTOM ANIMATIONS ===== */}
      <style>{`
        /* Prevent body scroll when cart is open */
        body:has([aria-modal="true"][class*="translate-x-0"]) {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

