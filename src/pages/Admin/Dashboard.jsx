import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsThunks';
import { Package, ShoppingCart, DollarSign, AlertTriangle, Boxes, Tag } from 'lucide-react';
import { 
  StatCard, 
  ProductsTable, 
  ProductsCards, 
  EmptyState, 
  LowStockCard 
} from '../../components/DashboardComponents';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { productsData, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // === Calculate Statistics ===
  const totalProducts = productsData?.length || 0;
  const soldProducts = productsData?.filter(p => (p.quantityVendu || 0) > 0) || [];
  const totalQuantitySold = productsData?.reduce((sum, p) => sum + (p.quantityVendu || 0), 0) || 0;
  const totalRevenue = productsData?.reduce((sum, p) => sum + ((p.price || 0) * (p.quantityVendu || 0)), 0) || 0;
  const totalStock = productsData?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0;
  const avgPrice = totalProducts > 0 ? productsData.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts : 0;

  // Low stock & out of stock
  const lowStockProducts = productsData?.filter(p => (p.stock || 0) < (p.minStock || 10) && (p.stock || 0) > 0) || [];
  const outOfStockCount = productsData?.filter(p => (p.stock || 0) === 0).length || 0;

  // Top selling products
  const topSellingProducts = [...(productsData || [])]
    .filter(p => (p.quantityVendu || 0) > 80)
    .sort((a, b) => (b.quantityVendu || 0) - (a.quantityVendu || 0))
    .slice(0, 10);

  // === Stats Cards Config ===
  const stats = [
    { title: 'Total Products', value: totalProducts, icon: Package, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Products Sold', value: soldProducts.length, subtitle: `${totalQuantitySold} units`, icon: ShoppingCart, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, bgColor: 'bg-[#9E3B3B]/10', iconColor: 'text-[#9E3B3B]' },
    { title: 'Total Stock', value: totalStock.toLocaleString(), subtitle: 'units available', icon: Boxes, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { title: 'Low Stock Alert', value: lowStockProducts.length, subtitle: `${outOfStockCount} out of stock`, icon: AlertTriangle, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
    { title: 'Average Price', value: `$${avgPrice.toFixed(2)}`, icon: Tag, bgColor: 'bg-teal-50', iconColor: 'text-teal-600' }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E3B3B]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">🏆 Top Selling Products</h2>
          <p className="text-sm text-gray-500 mt-1">Products with sales quantity {'>'} 80</p>
        </div>

        {topSellingProducts.length === 0 ? (
          <EmptyState message="No top selling products yet" />
        ) : (
          <>
            <div className="hidden md:block">
              <ProductsTable products={topSellingProducts} />
            </div>
            <div className="md:hidden">
              <ProductsCards products={topSellingProducts} />
            </div>
          </>
        )}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="text-amber-600" size={22} />
            </div>
            <div>
              <h3 className="font-bold text-amber-800">Low Stock Alert</h3>
              <p className="text-sm text-amber-600">{lowStockProducts.length} products need restocking</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 6).map((product) => (
              <LowStockCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
