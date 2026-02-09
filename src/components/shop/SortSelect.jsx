/**
 * SortSelect.jsx
 * 
 * A clean dropdown for sorting products.
 * Options:
 * - Price: Low to High
 * - Price: High to Low
 */

import { ChevronDown, ArrowUpDown } from 'lucide-react';

export default function SortSelect({ value, onChange }) {
  // Sort options as requested
  const sortOptions = [
    { value: 'default', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  return (
    <div className="relative">
      {/* Sort Icon */}
      <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      
      {/* Select Dropdown */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-11 pr-10 py-3 rounded-xl border-2 border-gray-200 bg-white
                   focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10
                   outline-none transition-all duration-300 text-sm text-gray-700
                   cursor-pointer min-w-[200px]"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Chevron Icon */}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

