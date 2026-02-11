/**
 * ShopFilters.jsx
 * 
 * Filter components for the shop/catalogue page.
 * Features:
 * - Category filter (checkbox style)
 * - Skin type filter
 * - Price range filter (min/max inputs)
 * - Search input
 * - Sort options
 * - Clear all filters
 * - Mobile-friendly drawer version
 */

import { Search, X, SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';

/* ============ Filter Section Wrapper ============ */
function FilterSection({ title, children, defaultOpen = true }) {
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
      <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

/* ============ Checkbox Filter Item ============ */
function CheckboxItem({ label, checked, onChange, count }) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
        checked 
          ? 'bg-[#9E3B3B] border-[#9E3B3B]' 
          : 'border-gray-300 group-hover:border-[#9E3B3B]/50'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm flex-1 transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  );
}

/* ============ Main Filters Component ============ */
export default function ShopFilters({
  filters,
  setFilters,
  productCounts,
  onClearFilters,
  className = ''
}) {
  // Category options
  const categories = [
    { value: 'cleanser', label: 'cleanser' },
    { value: 'moisturizer', label: 'moisturizer' },
    { value: 'serum', label: 'serum' },
    { value: 'sunscreen', label: 'sunscreen' }
  ];

  // Skin type options
  const skinTypes = [
    { value: 'dry', label: 'Dry Skin' },
    { value: 'oily', label: 'Oily Skin' },
    { value: 'normal', label: 'Normal Skin' },
    { value: 'sensitive', label: 'Sensitive Skin' },
    { value: 'combination', label: 'Combination Skin' },
    { value: 'all types', label: 'All Skin Types' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'default', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'name-za', label: 'Name: Z to A' }
  ];

  // Toggle category filter
  const toggleCategory = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  // Toggle skin type filter
  const toggleSkinType = (skinType) => {
    const newSkinTypes = filters.skinTypes.includes(skinType)
      ? filters.skinTypes.filter(s => s !== skinType)
      : [...filters.skinTypes, skinType];
    setFilters({ ...filters, skinTypes: newSkinTypes });
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.search || 
    filters.categories.length > 0 || 
    filters.skinTypes.length > 0 || 
    filters.minPrice || 
    filters.maxPrice ||
    filters.sort !== 'default';

  return (
    <div className={className}>
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#9E3B3B]" />
          <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-sm text-[#9E3B3B] hover:text-[#7a2e2e] font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Search Input */}
      <FilterSection title="Search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10 outline-none transition-all text-sm"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10 outline-none transition-all text-sm appearance-none bg-white cursor-pointer"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Categories">
        <div className="space-y-1">
          {categories.map(category => (
            <CheckboxItem
              key={category.value}
              label={category.label}
              checked={filters.categories.includes(category.value)}
              onChange={() => toggleCategory(category.value)}
              count={productCounts?.categories?.[category.value]}
            />
          ))}
        </div>
      </FilterSection>

      {/* Skin Types */}
      <FilterSection title="Skin Type">
        <div className="space-y-1">
          {skinTypes.map(skinType => (
            <CheckboxItem
              key={skinType.value}
              label={skinType.label}
              checked={filters.skinTypes.includes(skinType.value)}
              onChange={() => toggleSkinType(skinType.value)}
              count={productCounts?.skinTypes?.[skinType.value]}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1.5 block">Min ($)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/10 outline-none transition-all text-sm"
            />
          </div>
          <div className="pt-5 text-gray-400">—</div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1.5 block">Max ($)</label>
            <input
              type="number"
              min="0"
              placeholder="999"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/10 outline-none transition-all text-sm"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
}

/* ============ Mobile Filter Drawer ============ */
export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  productCounts,
  onClearFilters,
  resultCount
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 lg:hidden transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Filters
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
          <ShopFilters
            filters={filters}
            setFilters={setFilters}
            productCounts={productCounts}
            onClearFilters={onClearFilters}
          />
        </div>

        {/* Footer with Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Show {resultCount} Products
          </button>
        </div>
      </div>
    </>
  );
}

/* ============ Active Filters Pills ============ */
export function ActiveFilterPills({ filters, setFilters, onClearFilters }) {
  const pills = [];

  // Add search pill
  if (filters.search) {
    pills.push({ key: 'search', label: `"${filters.search}"`, onRemove: () => setFilters({ ...filters, search: '' }) });
  }

  // Add category pills
  filters.categories.forEach(cat => {
    pills.push({
      key: `cat-${cat}`,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      onRemove: () => setFilters({ ...filters, categories: filters.categories.filter(c => c !== cat) })
    });
  });

  // Add skin type pills
  filters.skinTypes.forEach(type => {
    pills.push({
      key: `skin-${type}`,
      label: type.charAt(0).toUpperCase() + type.slice(1) + ' Skin',
      onRemove: () => setFilters({ ...filters, skinTypes: filters.skinTypes.filter(s => s !== type) })
    });
  });

  // Add price range pill
  if (filters.minPrice || filters.maxPrice) {
    const priceLabel = filters.minPrice && filters.maxPrice
      ? `$${filters.minPrice} - $${filters.maxPrice}`
      : filters.minPrice
        ? `From $${filters.minPrice}`
        : `Up to $${filters.maxPrice}`;
    pills.push({
      key: 'price',
      label: priceLabel,
      onRemove: () => setFilters({ ...filters, minPrice: '', maxPrice: '' })
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-gray-500">Active filters:</span>
      {pills.map(pill => (
        <span
          key={pill.key}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9E3B3B]/10 text-[#9E3B3B] text-sm font-medium rounded-full"
        >
          {pill.label}
          <button
            onClick={pill.onRemove}
            className="hover:bg-[#9E3B3B]/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearFilters}
        className="text-sm text-gray-500 hover:text-[#9E3B3B] underline transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}

