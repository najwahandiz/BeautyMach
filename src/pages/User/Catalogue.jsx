/**
 * Catalogue.jsx (Shop Page)
 * 
 * A modern, luxurious, feminine shop page for skincare products.
 * 
 * Features:
 * - Product grid with beautiful cards
 * - Sidebar filters (desktop) / Drawer filters (mobile)
 * - Search, sort, category, skin type, and price filters
 * - Loading skeleton state
 * - Empty results state
 * - Responsive design
 * 
 * Data Flow:
 * 1. Products fetched from Redux store on mount
 * 2. Filters stored in local state
 * 3. filteredProducts computed based on all active filters
 * 4. Products displayed in responsive grid
 */

import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsThunks';
import ShopProductCard from '../../components/shop/ShopProductCard';
import ShopFilters, { MobileFilterDrawer, ActiveFilterPills } from '../../components/shop/ShopFilters';
import { 
  Sparkles, SlidersHorizontal, Package, Search, 
  ChevronRight, Loader2, ShoppingBag, Heart 
} from 'lucide-react';

/* ============ Loading Skeleton Component ============ */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
      {/* Content skeleton */}
      <div className="p-5">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded w-28" />
        </div>
      </div>
    </div>
  );
}

/* ============ Empty State Component ============ */
function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center">
        <Search className="w-10 h-10 text-[#9E3B3B]/40" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        No Products Found
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        {hasFilters 
          ? "We couldn't find any products matching your filters. Try adjusting your search criteria."
          : "No products available at the moment. Please check back soon!"
        }
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

/* ============ Main Catalogue Component ============ */
export default function Catalogue() {
  const dispatch = useDispatch();
  
  // Get products from Redux store
  const { productsData, loading, error } = useSelector((state) => state.products);

  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    sort: 'default',
    categories: [],
    skinTypes: [],
    minPrice: '',
    maxPrice: ''
  });

  // Fetch products on mount
  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsData]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      sort: 'default',
      categories: [],
      skinTypes: [],
      minPrice: '',
      maxPrice: ''
    });
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search ||
      filters.categories.length > 0 ||
      filters.skinTypes.length > 0 ||
      filters.minPrice ||
      filters.maxPrice
    );
  }, [filters]);

  // Calculate product counts for filters
  const productCounts = useMemo(() => {
    if (!productsData) return { categories: {}, skinTypes: {} };

    const counts = {
      categories: {},
      skinTypes: {}
    };

    productsData.forEach(product => {
      // Count categories
      if (product.subcategory) {
        counts.categories[product.subcategory] = (counts.categories[product.subcategory] || 0) + 1;
      }
      // Count skin types
      if (product.skinType) {
        counts.skinTypes[product.skinType] = (counts.skinTypes[product.skinType] || 0) + 1;
      }
    });

    return counts;
  }, [productsData]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!productsData) return [];

    let result = [...productsData];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.subcategory)
      );
    }

    // Skin type filter
    if (filters.skinTypes.length > 0) {
      result = result.filter(product =>
        filters.skinTypes.includes(product.skinType)
      );
    }

    // Price range filter
    if (filters.minPrice) {
      result = result.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      result = result.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Sort
    switch (filters.sort) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-az':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-za':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        // Default: featured (best sellers first)
        result.sort((a, b) => (b.quantityVendu || 0) - (a.quantityVendu || 0));
    }

    return result;
  }, [productsData, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fffaf5] to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#fffaf5] via-white to-[#fff5ee] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            {/* Decorative element */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#9E3B3B]/10 mb-6">
              <Sparkles className="w-4 h-4 text-[#9E3B3B]" />
              <span className="text-sm font-medium text-[#9E3B3B]">Premium Skincare Collection</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shop
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover our curated collection of premium skincare products, formulated to reveal your natural radiance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 p-6">
              <ShopFilters
                filters={filters}
                setFilters={setFilters}
                productCounts={productCounts}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Top Bar: Product Count + Mobile Filter Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* Product Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#9E3B3B]/10 rounded-lg">
                  <Package className="w-5 h-5 text-[#9E3B3B]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Showing</p>
                  <p className="font-bold text-gray-900">
                    {loading ? '...' : `${filteredProducts.length} products`}
                  </p>
                </div>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-[#9E3B3B] hover:text-[#9E3B3B] transition-all"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-[#9E3B3B] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {filters.categories.length + filters.skinTypes.length + (filters.search ? 1 : 0) + (filters.minPrice || filters.maxPrice ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Active Filter Pills */}
            <ActiveFilterPills
              filters={filters}
              setFilters={setFilters}
              onClearFilters={clearFilters}
            />

            {/* Product Grid */}
            {loading ? (
              // Loading State - Skeletons
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              // Error State
              <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
                <div className="text-6xl mb-6">😕</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  We couldn't load the products. Please try again.
                </p>
                <button
                  onClick={() => dispatch(fetchProducts())}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              // Empty State
              <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
            ) : (
              // Product Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Bottom CTA Section */}
            {!loading && filteredProducts.length > 0 && (
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-[#9E3B3B]/5 via-[#fffaf5] to-[#ea7b7b]/5 rounded-3xl p-8 sm:p-12 border border-[#9E3B3B]/10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
                    <Heart className="w-4 h-4 text-[#9E3B3B] fill-current" />
                    <span className="text-sm font-medium text-[#9E3B3B]">Need help choosing?</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Find Your Perfect Routine
                  </h3>
                  <p className="text-gray-500 max-w-xl mx-auto mb-6">
                    Take our quick skin quiz and get AI-powered product recommendations tailored to your unique skin needs.
                  </p>
                  <a
                    href="/skin-quiz"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-bold rounded-2xl shadow-xl shadow-[#9E3B3B]/30 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5" />
                    Take the Skin Quiz
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        productCounts={productCounts}
        onClearFilters={clearFilters}
        resultCount={filteredProducts.length}
      />
    </div>
  );
}
