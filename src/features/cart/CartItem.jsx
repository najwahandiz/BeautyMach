/**
 * CartItem.jsx
 * 
 * Individual cart item component displayed in the cart sidebar.
 * Shows product image, name, price, quantity controls, and remove button.
 * 
 * Features:
 * - Elegant, feminine design
 * - Quantity increase/decrease buttons
 * - Smooth hover effects
 * - Remove item functionality
 */

import { useDispatch } from 'react-redux';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { increaseQuantity, decreaseQuantity, removeFromCart } from './cartSlice';
import { formatPrice } from './cartUtils';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  
  // Destructure item data
  const { id, name, price, imageUrl, quantity } = item;
  
  // Calculate item total (price × quantity)
  const itemTotal = price * quantity;
  
  // ===== EVENT HANDLERS =====
  
  const handleIncrease = () => {
    dispatch(increaseQuantity(id));
  };
  
  const handleDecrease = () => {
    dispatch(decreaseQuantity(id));
  };
  
  const handleRemove = () => {
    dispatch(removeFromCart(id));
  };
  
  return (
    <div className="group relative flex gap-4 p-4 bg-white rounded-2xl border border-[#f5e6e0] hover:border-[#ea7b7b]/30 transition-all duration-300 hover:shadow-md">
      
      {/* ===== PRODUCT IMAGE ===== */}
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#fff8f5] to-[#ffeee8]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // Placeholder if no image
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#9E3B3B]/10 flex items-center justify-center">
              <span className="text-[#9E3B3B] text-lg font-serif">
                {name?.charAt(0) || '?'}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* ===== PRODUCT INFO ===== */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        
        {/* Name & Remove Button Row */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-gray-800 text-sm leading-tight line-clamp-2 font-serif">
            {name}
          </h4>
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {/* Price & Quantity Row */}
        <div className="flex items-center justify-between mt-2">
          
          {/* Unit Price */}
          <p className="text-xs text-gray-500">
            {formatPrice(price)}
          </p>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            
            {/* Decrease Button */}
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className={`
                w-7 h-7 rounded-lg flex items-center justify-center
                transition-all duration-200
                ${quantity <= 1 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                  : 'bg-[#fff0eb] text-[#9E3B3B] hover:bg-[#9E3B3B] hover:text-white active:scale-95'
                }
              `}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            
            {/* Quantity Display */}
            <span className="w-8 text-center text-sm font-semibold text-gray-800">
              {quantity}
            </span>
            
            {/* Increase Button */}
            <button
              onClick={handleIncrease}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#fff0eb] text-[#9E3B3B] hover:bg-[#9E3B3B] hover:text-white transition-all duration-200 active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        
        {/* Item Total */}
        <p className="text-sm font-semibold text-[#9E3B3B] mt-1">
          {formatPrice(itemTotal)}
        </p>
      </div>
    </div>
  );
}

