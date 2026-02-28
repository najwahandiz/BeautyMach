/**
 * RecommendedProductCard
 *
 * Displays one recommended product with Add to Cart button.
 * Used in the Results screen for each routine step.
 */

import { useSelector } from 'react-redux';
import { Sparkles, ShoppingBag, Check } from 'lucide-react';
import { addToCart } from '../../features/cart/cartSlice';
import { selectIsInCart } from '../../features/cart/cartSelectors';
import { useToast } from '../Toast';

export default function RecommendedProductCard({ stepKey, stepInfo, recommendation, product, dispatch }) {
  const { showToast } = useToast();
  const isInCart = useSelector((state) => selectIsInCart(state, product?.id));

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        name: product.name || recommendation.name,
        price: product.price || 0,
        imageUrl: product.imageUrl || product.image || '',
        category: stepKey
      }));
      showToast(`${product.name || recommendation.name} added to cart!`, 'success');
    }
  };

  const productName = product?.name || recommendation.name;
  const productImage = product?.imageUrl || product?.image;
  const productPrice = product?.price?.toFixed(2) || '0.00';

  return (
    <div className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-[#9E3B3B]/10 transition-all duration-500">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-[#b35b5b] to-[#b35b5b] px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ea7b7b] to-[#ea7b7b] text-white flex items-center justify-center text-sm font-bold shadow-lg">
            {stepInfo.step}
          </div>
          <div>
            <p className="text-xs text-gray-100 uppercase tracking-wider">{stepInfo.description}</p>
            <p className="font-semibold text-gray-300 flex items-center gap-2">
              <span>{stepInfo.icon}</span>
              {stepInfo.label}
            </p>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5">
        <div className="flex gap-4">
          {/* Product Image */}
          {productImage ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
              <img
                src={productImage}
                alt={recommendation.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-[#9E3B3B]/40" />
            </div>
          )}

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-[#9E3B3B] transition-colors">
              {recommendation.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
              {recommendation.reason}
            </p>
          </div>
        </div>

        {/* Price & Add to Cart */}
        {product && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-2xl font-bold text-[#9E3B3B]">${productPrice}</p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={
                isInCart
                  ? 'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-100 text-emerald-700 cursor-default transition-all duration-300'
                  : 'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white hover:shadow-lg hover:shadow-[#9E3B3B]/30 hover:scale-105 transition-all duration-300'
              }
            >
              {isInCart ? (
                <>
                  <Check size={16} />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
