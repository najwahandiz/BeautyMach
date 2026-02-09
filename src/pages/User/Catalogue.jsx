/**
 * Catalogue.jsx (Shop Page)
 * 
 * A modern, premium shop page with cleaner UX.
 * 
 * Layout:
 * - TOP: Search bar + Sort dropdown
 * - LEFT: Sticky sidebar with filters (Category + Skin Type only)
 * - RIGHT: Product grid with smaller, elegant cards
 * 
 * Features:
 * - Search by product name (case-insensitive)
 * - Sort by price (low/high)
 * - Filter by category and skin type
 * - Responsive design (sidebar collapses on mobile)
 */

import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsThunks';
import { Sparkles, SlidersHorizontal, Package, Heart, ChevronRight } from 'lucide-react';

// Import new components
import SearchBar from '../../components/shop/SearchBar';
import SortSelect from '../../components/shop/SortSelect';
import FiltersSidebar, { MobileFilterDrawer } from '../../components/shop/FiltersSidebar';
import ProductGrid from '../../components/shop/ProductGrid';

export default function Catalogue() {
  const dispatch = useDispatch();
  
  // Get products from Redux store
  const { productsData, loading, error } = useSelector((state) => state.products);

  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter state - simplified (no price range)
  const [filters, setFilters] = useState({
    search: '',
    sort: 'default',
    categories: [],
    skinTypes: []
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
      skinTypes: []
    });
  };

  // Check if any filters are active (for mobile badge)
  const activeFilterCount = useMemo(() => {
    return filters.categories.length + filters.skinTypes.length;
  }, [filters]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!productsData) return [];

    let result = [...productsData];

    // Search filter (case-insensitive)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter (case-insensitive comparison)
    if (filters.categories.length > 0) {
      result = result.filter(product => {
        const productCategory = (product.subcategory || '').toLowerCase();
        // Check if any selected filter matches the product category
        return filters.categories.some(cat => productCategory.includes(cat.toLowerCase()));
      });
    }

    // Skin type filter (case-insensitive comparison)
    if (filters.skinTypes.length > 0) {
      result = result.filter(product => {
        const productSkinType = (product.skinType || '').toLowerCase();
        // Check if any selected filter matches the product skin type
        return filters.skinTypes.some(type => productSkinType.includes(type.toLowerCase()));
      });
    }

    // Sort products
    switch (filters.sort) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        // Default: featured (best sellers first)
        result.sort((a, b) => (b.quantityVendu || 0) - (a.quantityVendu || 0));
    }

    return result;
  }, [productsData, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fffaf5] to-white">
      {/* Hero Header - Compact */}
      <div className="bg-gradient-to-r from-[#fffaf5] via-white to-[#fff5ee] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#9E3B3B]/10 mb-4">
              <Sparkles className="w-4 h-4 text-[#9E3B3B]" />
              <span className="text-sm font-medium text-[#9E3B3B]">Premium Skincare</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shop
            </h1>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Discover our curated collection of premium skincare products.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* TOP BAR: Search + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
          {/* Search Bar */}
          <SearchBar 
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value })}
            placeholder="Search products..."
          />
          
          {/* Right side: Sort + Mobile Filter Button */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <SortSelect 
              value={filters.sort}
              onChange={(value) => setFilters({ ...filters, sort: value })}
            />
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-[#9E3B3B] hover:text-[#9E3B3B] transition-all"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#9E3B3B] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content Area: Sidebar + Product Grid */}
        <div className="flex gap-8">
          
          {/* Sidebar Filters - Desktop Only, Sticky */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersSidebar
                filters={filters}
                setFilters={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Product Count */}
            <div className="flex items-center gap-2 mb-5">
              <Package className="w-4 h-4 text-[#9E3B3B]" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </p>
            </div>

            {/* Error State */}
            {error ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-5 text-sm">
                  We couldn't load the products. Please try again.
                </p>
                <button
                  onClick={() => dispatch(fetchProducts())}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              /* Product Grid */
              <ProductGrid 
                products={filteredProducts}
                loading={loading}
                onClearFilters={clearFilters}
              />
            )}

            {/* Bottom CTA Section */}
            {!loading && filteredProducts.length > 0 && (
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-[#9E3B3B]/5 via-[#fffaf5] to-[#ea7b7b]/5 rounded-2xl p-8 border border-[#9E3B3B]/10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm mb-4">
                    <Heart className="w-4 h-4 text-[#9E3B3B] fill-current" />
                    <span className="text-xs font-medium text-[#9E3B3B]">Need help?</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Find Your Perfect Routine
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-5 text-sm">
                    Take our quick skin quiz and get AI-powered recommendations.
                  </p>
                  <a
                    href="/skin-quiz"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-bold rounded-xl shadow-lg shadow-[#9E3B3B]/25 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Take the Skin Quiz
                    <ChevronRight className="w-4 h-4" />
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
        onClearFilters={clearFilters}
        resultCount={filteredProducts.length}
      />
    </div>
  );
}
