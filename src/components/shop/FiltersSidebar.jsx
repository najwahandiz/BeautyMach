/**
 * FiltersSidebar.jsx
 * 
 * A clean, minimal sidebar for product filters.
 * 
 * Features:
 * - Category filter (by subcategory field)
 * - Skin Type filter (by skinType field)
 * - Clean UX with no count numbers
 * - Sticky positioning
 */

import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';

/* ============ Checkbox Filter Item ============ */
function CheckboxItem({ label, checked, onChange }) {
  return (
    // The label wraps everything - clicking anywhere triggers the hidden input
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      {/* Hidden real checkbox for accessibility */}
      <input 
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      
      {/* Custom styled checkbox */}
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
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
      
      {/* Label text */}
      <span className={`text-sm transition-colors ${
        checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-800'
      }`}>
        {label}
      </span>
    </label>
  );
}

/* ============ Filter Section ============ */
function FilterSection({ title, children }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
        {title}
      </h4>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

/* ============ Main FiltersSidebar Component ============ */
export default function FiltersSidebar({
  filters,
  setFilters,
  onClearFilters
}) {
  // Category options - these match the actual subcategory values in database
  const categories = [
    { value: 'cleanser', label: 'Cleansers' },
    { value: 'serum', label: 'Serums' },
    { value: 'moisturizer', label: 'Moisturizers' },
    { value: 'sunscreen', label: 'Sunscreen' }
  ];

  // Skin type options - these match the actual skinType values in database
  const skinTypes = [
    { value: 'dry', label: 'Dry' },
    { value: 'oily', label: 'Oily' },
    { value: 'sensitive', label: 'Sensitive' },
    { value: 'normal', label: 'Normal' },
    { value: 'all types', label: 'All Types' }
  ];

  // Toggle a category filter on/off
  const toggleCategory = (categoryValue) => {
    const isSelected = filters.categories.includes(categoryValue);
    const newCategories = isSelected
      ? filters.categories.filter(c => c !== categoryValue)  // Remove if selected
      : [...filters.categories, categoryValue];               // Add if not selected
    
    setFilters({ ...filters, categories: newCategories });
  };

  // Toggle a skin type filter on/off
  const toggleSkinType = (skinTypeValue) => {
    const isSelected = filters.skinTypes.includes(skinTypeValue);
    const newSkinTypes = isSelected
      ? filters.skinTypes.filter(s => s !== skinTypeValue)   // Remove if selected
      : [...filters.skinTypes, skinTypeValue];                // Add if not selected
    
    setFilters({ ...filters, skinTypes: newSkinTypes });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.categories.length > 0 || filters.skinTypes.length > 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#9E3B3B]" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        {/* Clear button - only shows when filters are active */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-[#9E3B3B] hover:text-[#7a2e2e] font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection title="Category">
        {categories.map(category => (
          <CheckboxItem
            key={category.value}
            label={category.label}
            checked={filters.categories.includes(category.value)}
            onChange={() => toggleCategory(category.value)}
          />
        ))}
      </FilterSection>

      {/* Skin Type Filter */}
      <FilterSection title="Skin Type">
        {skinTypes.map(skinType => (
          <CheckboxItem
            key={skinType.value}
            label={skinType.label}
            checked={filters.skinTypes.includes(skinType.value)}
            onChange={() => toggleSkinType(skinType.value)}
          />
        ))}
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
  onClearFilters,
  resultCount
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer panel */}
      <div className={`fixed inset-y-0 left-0 w-[280px] bg-white z-50 lg:hidden transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
          <FiltersSidebar
            filters={filters}
            setFilters={setFilters}
            onClearFilters={onClearFilters}
          />
        </div>

        {/* Footer with show results button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#9E3B3B] text-white font-medium rounded-lg hover:bg-[#8a3333] transition-colors"
          >
            Show {resultCount} Products
          </button>
        </div>
      </div>
    </>
  );
}
