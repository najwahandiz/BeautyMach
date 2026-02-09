/**
 * ProductGrid.jsx
 * 
 * A responsive grid for displaying product cards.
 * Layout:
 * - Desktop: 3-4 columns
 * - Tablet: 2 columns
 * - Mobile: 1 column
 */

import ProductCard from './ProductCard';
import { Search, Package, RotateCcw } from 'lucide-react';

/* ============ Loading Skeleton ============ */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200" />
      {/* Content skeleton */}
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full mb-3" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded flex-1" />
          <div className="h-10 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/* ============ Empty State ============ */
function EmptyState({ onClearFilters }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="w-20 h-20 mb-5 rounded-2xl bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center">
        <Search className="w-8 h-8 text-[#9E3B3B]/40" />
      </div>
      
      {/* Message */}
      <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        No Products Found
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-5 text-sm">
        We couldn't find any products matching your filters. Try adjusting your search criteria.
      </p>
      
      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Clear Filters
      </button>
    </div>
  );
}

/* ============ Main ProductGrid Component ============ */
export default function ProductGrid({ products, loading, onClearFilters }) {
  // Loading state - show skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  // Product grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

