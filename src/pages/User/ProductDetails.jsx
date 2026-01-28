/**
 * ProductDetails.jsx
 * 
 * Product Details Page - displays full information about a single product.
 * 
 * HOW IT WORKS:
 * 1. Gets product ID from URL using useParams()
 * 2. Finds product in Redux store by ID
 * 3. Displays product info or "not found" message
 * 
 * KEY CONCEPTS FOR BEGINNERS:
 * - useParams() extracts dynamic parts from URL (like :id)
 * - We find the product by matching IDs
 * - If product doesn't exist, we show an error state
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
  Heart,
  Share2,
  Package,
  Truck,
  Shield
} from 'lucide-react';
import { fetchProducts } from '../../features/products/productsThunks';
import { addToCart, openCart } from '../../features/cart/cartSlice';
import { selectIsInCart, selectItemQuantity } from '../../features/cart/cartSelectors';
import { useToast } from '../../components/Toast';

export default function ProductDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // ===== GET PRODUCT ID FROM URL =====
  // useParams() reads the :id part from the URL /products/:id
  // Example: /products/abc123 → id = "abc123"
  const { id } = useParams();
  
  // ===== GET PRODUCTS FROM REDUX STORE =====
  const { productsData, loading } = useSelector((state) => state.products);
  
  // ===== FIND THE PRODUCT BY ID =====
  // We search through all products to find the one matching our URL id
  const product = productsData?.find(p => p.id === id);
  
  // ===== CHECK IF PRODUCT IS IN CART =====
  const isInCart = useSelector(state => selectIsInCart(state, id));
  const quantityInCart = useSelector(state => selectItemQuantity(state, id));
  
  // ===== FETCH PRODUCTS IF NOT LOADED =====
  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsData]);
  
  // ===== ADD TO CART HANDLER =====
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
  
  // ===== HELPER FUNCTIONS =====
  
  // Format skin type for display
  const formatSkinType = (skinType) => {
    if (!skinType) return null;
    return skinType.charAt(0).toUpperCase() + skinType.slice(1);
  };
  
  // Get category display name
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
  
  // Check if product is a best seller
  const isBestSeller = product?.quantityVendu > 50;
  
  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
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
  
  // ===== PRODUCT NOT FOUND STATE =====
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          {/* Decorative Icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center">
            <Package className="w-12 h-12 text-[#9E3B3B]/40" />
          </div>
          
          {/* Message */}
          <h1 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Product Not Found
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            We couldn't find the product you're looking for. It may have been removed or the link might be incorrect.
          </p>
          
          {/* Back to Shop Button */}
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
  
  // ===== MAIN PRODUCT DETAILS VIEW =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        
        {/* ===== BREADCRUMB / BACK BUTTON ===== */}
        <nav className="mb-8">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#9E3B3B] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Shop</span>
          </Link>
        </nav>
        
        {/* ===== PRODUCT CONTENT ===== */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* ===== LEFT: PRODUCT IMAGE ===== */}
          <div className="relative">
            {/* Main Image */}
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
              
              {/* Best Seller Badge */}
              {isBestSeller && (
                <div className="absolute top-6 left-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white text-sm font-semibold rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Best Seller
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all">
                <Heart className="w-5 h-5 text-gray-600 hover:text-[#9E3B3B]" />
              </button>
              <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* ===== RIGHT: PRODUCT INFO ===== */}
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
                {product.price?.toFixed(2)} MAD
              </span>
            </div>
            
            {/* Short Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description || 'A premium skincare product formulated with the finest ingredients to reveal your natural radiance.'}
            </p>
            
            {/* Skin Type Tag */}
            {product.skinType && (
              <div className="mb-8">
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
            
            {/* Add to Cart Section */}
            <div className="space-y-4">
              {/* Cart Status */}
              {isInCart && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Already in cart ({quantityInCart} {quantityInCart === 1 ? 'item' : 'items'})</span>
                </div>
              )}
              
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white text-lg font-semibold rounded-2xl shadow-xl shadow-[#9E3B3B]/25 hover:shadow-2xl hover:shadow-[#9E3B3B]/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" />
                {isInCart ? 'Add Another' : 'Add to Cart'}
              </button>
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
        
        {/* ===== PRODUCT DETAILS SECTION ===== */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          
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
          
          {/* How to Use Card */}
          <div className="bg-gradient-to-br from-[#fffaf5] to-[#fff5ee] rounded-3xl p-8 border border-[#9E3B3B]/10">
            <h2 
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              How to Use
            </h2>
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9E3B3B] text-white text-sm font-bold flex items-center justify-center">1</span>
                <span>Cleanse your face with lukewarm water</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9E3B3B] text-white text-sm font-bold flex items-center justify-center">2</span>
                <span>Apply a small amount to your fingertips</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9E3B3B] text-white text-sm font-bold flex items-center justify-center">3</span>
                <span>Gently massage onto face and neck in upward motions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9E3B3B] text-white text-sm font-bold flex items-center justify-center">4</span>
                <span>Use morning and evening for best results</span>
              </li>
            </ol>
          </div>
        </div>
        
        {/* ===== CTA SECTION ===== */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#9E3B3B]/5 via-[#fffaf5] to-[#ea7b7b]/5 rounded-3xl p-8 sm:p-12 border border-[#9E3B3B]/10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#9E3B3B]" />
              <span className="text-sm font-medium text-[#9E3B3B]">Find Your Perfect Match</span>
            </div>
            <h3 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Not sure if this is right for you?
            </h3>
            <p className="text-gray-500 max-w-xl mx-auto mb-6">
              Take our quick skin quiz and discover products tailored to your unique skin type and concerns.
            </p>
            <Link
              to="/skin-quiz"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-bold rounded-2xl shadow-xl shadow-[#9E3B3B]/25 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              Take the Skin Quiz
            </Link>
          </div>
        </div>
      </div>
      
      {/* Fade-in Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
