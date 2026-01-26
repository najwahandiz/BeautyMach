import { Search } from 'lucide-react';

/**
 * ProductFilters Component
 * 
 * This component displays the search bar and filter dropdowns
 * for the products table.
 * 
 * Props:
 * - searchTerm: current search text
 * - onSearchChange: function to update search text
 * - selectedCategory: current selected category
 * - onCategoryChange: function to update category
 * - stockFilter: current stock sorting option
 * - onStockFilterChange: function to update stock filter
 * - categories: list of available categories
 */
export default function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  stockFilter,
  onStockFilterChange,
  categories
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e5e5d1] p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#9E3B3B] outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-3">
          {/* Category Filter */}
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#9E3B3B] outline-none bg-white"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Stock Sort Filter */}
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#9E3B3B] outline-none bg-white"
            value={stockFilter}
            onChange={(e) => onStockFilterChange(e.target.value)}
          >
            <option value="highToLow">High Stock First</option>
            <option value="lowToHigh">Low Stock First</option>
          </select>
        </div>

      </div>
    </div>
  );
}

