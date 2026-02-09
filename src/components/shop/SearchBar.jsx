/**
 * SearchBar.jsx
 * 
 * A clean, elegant search input for the shop page.
 * Features:
 * - Search icon
 * - Clear button when text is entered
 * - Smooth focus animations
 */

import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="relative flex-1 max-w-md">
      {/* Search Icon */}
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      
      {/* Search Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 bg-white 
                   focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10 
                   outline-none transition-all duration-300 text-sm text-gray-700
                   placeholder:text-gray-400"
      />
      
      {/* Clear Button - shows only when there's text */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 
                     hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

