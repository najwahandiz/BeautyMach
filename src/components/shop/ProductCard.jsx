/**
 * ProductCard.jsx
 * 
 * A smaller, cleaner, more elegant product card.
 * Features:
 * - Reduced image height (aspect-[4/3] instead of square)
 * - Less padding
 * - Clean typography
 * - Subtle hover animation (lift + shadow)
 * - Add to Cart + View Details buttons
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Eye, Sparkles } from 'lucide-react';
import { addToCart, openCart } from '../../features/cart/cartSlice';
import { selectIsInCart } from '../../features/cart/cartSelectors';
import { useToast } from '../Toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if product is already in cart
  const isInCart = useSelector(state => selectIsInCart(state, product?.id));

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        imageUrl: product.imageUrl || '',
        category: product.subcategory || ''
      }));
      showToast(`${product.name} added to cart!`, 'success');
      dispatch(openCart());
    }
  };

  // Format skin type for display
  const getSkinTypeDisplay = (skinType) => {
    if (!skinType) return null;
    return skinType.charAt(0).toUpperCase() + skinType.slice(1);
  };

  if (!product) return null;

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 
                 hover:border-[#9E3B3B]/20 transition-all duration-300 
                 hover:shadow-xl hover:shadow-[#9E3B3B]/8 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - Smaller aspect ratio */}
      <Link to={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#fffaf5] to-[#fff5ee]">
        {/* Product Image */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-[#9E3B3B]/15" />
          </div>
        )}

        {/* Skin Type Badge - Top Left */}
        {product.skinType && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#9E3B3B] text-xs font-medium rounded-full shadow-sm">
              {getSkinTypeDisplay(product.skinType)}
            </span>
          </div>
        )}
      </Link>

      {/* Content - Less padding */}
      <div className="p-4">
        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-[#9E3B3B] transition-colors duration-300 line-clamp-1" 
              style={{ fontFamily: 'Playfair Display, serif' }}>
            {product.name}
          </h3>
        </Link>

        {/* Short Description - 1 line max */}
        <p className="text-gray-500 text-xs mb-3 line-clamp-1">
          {product.description || 'Premium skincare for your needs'}
        </p>

        {/* Price */}
        <p className="text-lg font-bold text-[#9E3B3B] mb-3">
          ${product.price?.toFixed(2) || '0.00'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              isInCart
                ? 'bg-emerald-50 text-emerald-600 cursor-default'
                : 'bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white hover:shadow-md hover:shadow-[#9E3B3B]/25 active:scale-95'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>

         
        </div>
      </div>
    </div>
  );
}

