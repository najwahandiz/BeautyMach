import { ShoppingCart } from 'lucide-react';

/* ============ Stat Card Component ============ */
export function StatCard({ title, value, subtitle, icon: Icon, bgColor, iconColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3.5 rounded-xl ${bgColor}`}>
          <Icon size={24} className={iconColor} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ Stock Badge Component ============ */
export function StockBadge({ stock, minStock = 10 }) {
  if (stock === 0) {
    return (
      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Out of Stock
      </span>
    );
  }
  if (stock < minStock) {
    return (
      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Low ({stock})
      </span>
    );
  }
  return (
    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      In Stock ({stock})
    </span>
  );
}

/* ============ Product Image Component ============ */
export function ProductImage({ product, size = 'md' }) {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };

  const imageUrl = product.imageUrl || product.image;

  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={product.name} 
        className={`${sizes[size]} rounded-xl object-cover border border-gray-100`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-[#9E3B3B]/20 to-[#9E3B3B]/10 flex items-center justify-center text-[#9E3B3B] font-bold`}>
      {product.name?.[0]}
    </div>
  );
}

/* ============ Empty State Component ============ */
export function EmptyState({ message = "No data available" }) {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <ShoppingCart size={28} className="text-gray-400" />
      </div>
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
}

/* ============ Top Products Table (Desktop) ============ */
export function ProductsTable({ products }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/80">
          <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-4 text-left">Product</th>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Price</th>
            <th className="px-6 py-4 text-left">Qty Sold</th>
            <th className="px-6 py-4 text-left">Revenue</th>
            <th className="px-6 py-4 text-left">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-[#9E3B3B]/5 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ProductImage product={product} size="md" />
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">ID: {product.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 capitalize">
                {product.subcategory || product.category || '-'}
              </td>
              <td className="px-6 py-4 font-semibold text-gray-800">
                ${product.price?.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700 font-semibold text-sm">
                  {product.quantityVendu || 0} units
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-[#9E3B3B]">
                ${((product.price || 0) * (product.quantityVendu || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4">
                <StockBadge stock={product.stock} minStock={product.minStock} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============ Top Products Cards (Mobile) ============ */
export function ProductsCards({ products }) {
  return (
    <div className="divide-y divide-gray-100">
      {products.map((product) => (
        <div key={product.id} className="p-4 hover:bg-gray-50/50 transition-colors">
          <div className="flex items-start gap-4">
            <ProductImage product={product} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{product.name}</p>
              <p className="text-sm text-gray-500 capitalize mt-0.5">
                {product.subcategory || product.category || '-'}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-lg font-bold text-[#9E3B3B]">
                  ${product.price?.toFixed(2)}
                </span>
                <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                  {product.quantityVendu || 0} sold
                </span>
              </div>
              <div className="mt-2">
                <StockBadge stock={product.stock} minStock={product.minStock} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ Low Stock Alert Card ============ */
export function LowStockCard({ product }) {
  return (
    <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <ProductImage product={product} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
        <p className="text-xs text-amber-600 font-bold mt-0.5">
          ⚠️ Only {product.stock} left
        </p>
      </div>
    </div>
  );
}

