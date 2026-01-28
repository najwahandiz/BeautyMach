/**
 * ShopProductCard.jsx
 * 
 * A beautiful, luxury product card for the shop/catalogue page.
 * Features:
 * - Product image with hover zoom effect
 * - Best seller badge
 * - Product name, description, skin type tags
 * - Price display
 * - Add to Cart button with micro-interactions
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Check, Eye, Sparkles, Star } from 'lucide-react';
import { addToCart, selectIsInCart } from '../../features/cart/cartSlice';
import { useToast } from '../Toast';

export default function ShopProductCard({ product }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if product is already in cart
  const isInCart = useSelector(state => selectIsInCart(state, product?.id));

  // Handle add to cart
  const handleAddToCart = (e) => {
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
    }
  };

  // Check if product is a "best seller" (has high sales)
  const isBestSeller = product?.quantityVendu > 50;

  // Format skin type for display
  const getSkinTypeDisplay = (skinType) => {
    if (!skinType) return null;
    return skinType.charAt(0).toUpperCase() + skinType.slice(1);
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const labels = {
      cleansers: 'Cleanser',
      moisturizers: 'Moisturizer',
      serums: 'Serum',
      sunscreen: 'Sunscreen'
    };
    return labels[category] || category;
  };

  if (!product) return null;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#9E3B3B]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#9E3B3B]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#fffaf5] to-[#fff5ee]">
        {/* Product Image */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-[#9E3B3B]/20" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Best Seller Badge */}
        {isBestSeller && (
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white text-xs font-semibold rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              Best Seller
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#9E3B3B] text-xs font-medium rounded-full shadow-sm">
            {getCategoryLabel(product.subcategory)}
          </span>
        </div>

        {/* Quick View Button - appears on hover */}
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full shadow-lg hover:bg-white transition-colors">
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Skin Type Tag */}
        {product.skinType && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-1 bg-[#fffaf5] text-[#9E3B3B]/80 text-xs font-medium rounded-md border border-[#9E3B3B]/10">
              {getSkinTypeDisplay(product.skinType)} Skin
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#9E3B3B] transition-colors duration-300 line-clamp-1" style={{ fontFamily: 'Playfair Display, serif' }}>
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description || 'Premium skincare formulated for your unique needs.'}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Price */}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Price</p>
            <p className="text-2xl font-bold text-[#9E3B3B]">
              ${product.price?.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isInCart
                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                : 'bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white hover:shadow-lg hover:shadow-[#9E3B3B]/30 hover:scale-105 active:scale-95'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

