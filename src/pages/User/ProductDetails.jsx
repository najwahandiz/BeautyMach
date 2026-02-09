/**
 * ProductDetails.jsx
 * 
 * Modern, professional Product Details Page with quantity controls, ingredients, and size.
 * 
 * HOW IT WORKS:
 * 1. Gets product ID from URL using useParams()
 * 2. Finds product in Redux store by ID
 * 3. Displays product info or "not found" message
 */

import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  Star, 
  Sparkles,
  Droplets,
  Package,
  Truck,
  Shield,
  Plus,
  Minus
} from 'lucide-react';
import { fetchProducts } from '../../features/products/productsThunks';
import { addToCart, increaseQuantity, decreaseQuantity, openCart } from '../../features/cart/cartSlice';
import { selectIsInCart, selectItemQuantity } from '../../features/cart/cartSelectors';
import { useToast } from '../../components/Toast';

export default function ProductDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Get product ID from URL
  const { id } = useParams();
  
  // Get products from Redux store
  const { productsData, loading } = useSelector((state) => state.products);
  
  // Find the product by ID
  const product = productsData?.find(p => p.id === id);
  
  // Check if product is in cart and get quantity
  const isInCart = useSelector(state => selectIsInCart(state, id));
  const quantityInCart = useSelector(state => selectItemQuantity(state, id)) || 0;
  
  // Fetch products if not loaded
  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsData]);
  
  // Add to cart handler
  const handleAddToCart = () => {
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

  // Handle quantity increase
  const handleIncrease = () => {
    if (product) {
      if (!isInCart) {
        handleAddToCart();
      } else {
        dispatch(increaseQuantity(product.id));
      }
    }
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    if (product && quantityInCart > 1) {
      dispatch(decreaseQuantity(product.id));
    }
  };
  
  // Helper functions
  const formatSkinType = (skinType) => {
    if (!skinType) return null;
    return skinType.charAt(0).toUpperCase() + skinType.slice(1);
  };
  
  const getCategoryLabel = (category) => {
    const labels = {
      cleansers: 'Cleanser',
      moisturizers: 'Moisturizer',
      serums: 'Serum',
      sunscreen: 'Sun Protection',
      masks: 'Mask',
      toners: 'Toner',
      exfoliants: 'Exfoliant'
    };
    return labels[category] || category || 'Skincare';
  };
  
  const isBestSeller = product?.quantityVendu > 50;

  // Format ingredients
  const getIngredients = (ingredients) => {
    if (!ingredients) return [];
    if (typeof ingredients === 'string') {
      return ingredients.split(',').map(i => i.trim()).filter(Boolean);
    }
    return Array.isArray(ingredients) ? ingredients : [];
  };

  // Get size/volume
  const getSize = (product) => {
    if (product.size) return product.size;
    if (product.volume) return product.volume;
    return null;
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-3xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Product not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center">
            <Package className="w-12 h-12 text-[#9E3B3B]/40" />
          </div>
          
          <h1 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Product Not Found
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            We couldn't find the product you're looking for. It may have been removed or the link might be incorrect.
          </p>
          
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#9E3B3B]/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }
  
  const ingredients = getIngredients(product.ingredients);
  const size = getSize(product);
  
  // Main product details view
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20">
      {/* Narrower container with more margins */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        
        {/* Back Button */}
        <nav className="mb-8">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#9E3B3B] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Shop</span>
          </Link>
        </nav>
        
        {/* Product Content */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Product Image - Clean, no icons */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#fffaf5] to-[#fff5ee] border border-gray-100 shadow-2xl shadow-gray-200/50 group">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-[#9E3B3B]/20" />
                </div>
              )}
              
              {/* Best Seller Badge - only if applicable */}
              {isBestSeller && (
                <div className="absolute top-6 left-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white text-sm font-semibold rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Best Seller
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right: Product Info */}
          <div className="flex flex-col">
            
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9E3B3B]/10 text-[#9E3B3B] text-xs font-semibold rounded-full">
                <Droplets className="w-3 h-3" />
                {getCategoryLabel(product.subcategory)}
              </span>
            </div>
            
            {/* Product Name */}
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {product.name}
            </h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-[#9E3B3B]">
                ${product.price?.toFixed(2) || '0.00'}
              </span>
              {size && (
                <span className="text-lg text-gray-500">/ {size}</span>
              )}
            </div>
            
            {/* Short Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {product.description || 'A premium skincare product formulated with the finest ingredients to reveal your natural radiance.'}
            </p>
            
            {/* Size Display */}
            {size && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Package className="w-4 h-4 text-[#9E3B3B]" />
                  <span className="text-sm font-medium">Size: <span className="font-semibold">{size}</span></span>
                </div>
              </div>
            )}
            
            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Key Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {ingredients.slice(0, 6).map((ingredient, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 bg-[#fffaf5] text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
                {ingredients.length > 6 && (
                  <p className="text-xs text-gray-500 mt-2">+ {ingredients.length - 6} more ingredients</p>
                )}
              </div>
            )}
            
            {/* Skin Type Tag */}
            {product.skinType && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recommended for</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#fffaf5] to-[#fff5ee] text-[#9E3B3B] text-sm font-medium rounded-xl border border-[#9E3B3B]/10">
                    {formatSkinType(product.skinType)} Skin
                  </span>
                </div>
              </div>
            )}
            
            {/* Divider */}
            <div className="border-t border-gray-100 my-6" />
            
            {/* Add to Cart with Quantity Controls */}
            <div className="space-y-4">
              {/* Quantity Controls */}
              {isInCart && quantityInCart > 0 ? (
                <div className="flex items-center gap-4">
                  {/* Decrease Button */}
                  <button
                    onClick={handleDecrease}
                    disabled={quantityInCart <= 1}
                    className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 
                               text-gray-600 hover:border-[#9E3B3B] hover:text-[#9E3B3B] 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200 active:scale-95"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  {/* Quantity Display */}
                  <div className="flex-1 text-center">
                    <span className="text-lg font-semibold text-gray-900">{quantityInCart}</span>
                    <span className="text-sm text-gray-500 ml-2">in cart</span>
                  </div>

                  {/* Increase Button */}
                  <button
                    onClick={handleIncrease}
                    className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 
                               text-gray-600 hover:border-[#9E3B3B] hover:text-[#9E3B3B] 
                               transition-all duration-200 active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                /* Add to Cart Button */
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white text-lg font-semibold rounded-2xl shadow-xl shadow-[#9E3B3B]/25 hover:shadow-2xl hover:shadow-[#9E3B3B]/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
              )}
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
                <Truck className="w-5 h-5 text-[#9E3B3B] mb-2" />
                <span className="text-xs text-gray-600 font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
                <Shield className="w-5 h-5 text-[#9E3B3B] mb-2" />
                <span className="text-xs text-gray-600 font-medium">Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
                <Package className="w-5 h-5 text-[#9E3B3B] mb-2" />
                <span className="text-xs text-gray-600 font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Section */}
        <div className="mt-16">
          {/* Description Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <h2 
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              About This Product
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'This premium skincare product is carefully formulated to address your unique skin needs. Made with high-quality ingredients, it delivers visible results while being gentle on your skin.'}
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our products are dermatologically tested and free from harmful chemicals. Perfect for daily use as part of your skincare routine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
