// Catalogue — product listing with search, filters, and sort.
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsThunks';
import { Sparkles, SlidersHorizontal, Package, Heart, ChevronRight } from 'lucide-react';
import SearchBar from '../../components/shop/SearchBar';
import SortSelect from '../../components/shop/SortSelect';
import FiltersSidebar, { MobileFilterDrawer } from '../../components/shop/FiltersSidebar';
import ProductGrid from '../../components/shop/ProductGrid';

function filterAndSortProducts(products, filters) {
  if (!products?.length) return [];
  let list = [...products];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((p) => (p.name || '').toLowerCase().includes(q));
  }
  if (filters.categories.length > 0) {
    list = list.filter((p) =>
      filters.categories.some((cat) => (p.subcategory || '').toLowerCase().includes(cat.toLowerCase()))
    );
  }
  if (filters.skinTypes.length > 0) {
    list = list.filter((p) =>
      filters.skinTypes.some((t) => (p.skinType || '').toLowerCase().includes(t.toLowerCase()))
    );
  }
  if (filters.sort === 'price-low') list.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (filters.sort === 'price-high') list.sort((a, b) => (b.price || 0) - (a.price || 0));
  else list.sort((a, b) => (b.quantityVendu || 0) - (a.quantityVendu || 0));
  return list;
}

const initialFilters = { search: '', sort: 'default', categories: [], skinTypes: [] };

export default function Catalogue() {
  const dispatch = useDispatch();
  const { productsData, loading, error } = useSelector((state) => state.products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    if (!productsData?.length) dispatch(fetchProducts());
  }, [dispatch, productsData]);

  const clearFilters = () => setFilters(initialFilters);
  const activeFilterCount = filters.categories.length + filters.skinTypes.length;
  const filteredProducts = useMemo(
    () => filterAndSortProducts(productsData, filters),
    [productsData, filters]
  );

  return (
    <div className="min-h-screen bg-white mt-8">

       {/* 1. EDITORIAL HERO SECTION */}
       <header className="relative pt-16 pb-12 overflow-hidden bg-gradient-to-b from-[#9E3B3B]/10 via-white to-[#9E3B3B]/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#9E3B3B] font-semibold mb-4 block">
              Established 2026
            </span>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 italic" style={{ fontFamily: 'Playfair Display, serif' }}>
              The Skincare <span className="text-[#9E3B3B]">Atelier</span>
            </h1>
            <div className="h-[1px] w-24 bg-[#9E3B3B]/30 mx-auto mb-6"></div>
          </div>
          <p className="text-stone-500 font-light text-lg max-w-2xl mx-auto italic leading-relaxed">
            "Beauty begins the moment you decide to be yourself." Explore our curated essentials.
          </p>
        </div>
      </header>
      

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters((f) => ({ ...f, search: value }))}
            placeholder="Search products..."
          />
          
          {/* Right side: Sort + Mobile Filter Button */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <SortSelect
              value={filters.sort}
              onChange={(value) => setFilters((f) => ({ ...f, sort: value }))}
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

        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersSidebar
                filters={filters}
                setFilters={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-5">
              <Package className="w-4 h-4 text-[#9E3B3B]" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </p>
            </div>

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
              <ProductGrid
                products={filteredProducts}
                loading={loading}
                onClearFilters={clearFilters}
              />
            )}

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
