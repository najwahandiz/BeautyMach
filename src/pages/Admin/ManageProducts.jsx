import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsThunks';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import PopUpDelete from '../../components/popUpDelete';
import PopUpUpdate from '../../components/PopUpUpdate';
import ProductFilters from '../../features/products/ProductFilters';

const PRODUCTS_PER_PAGE = 8;

function getStockStatus(stock) {
  if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };
  if (stock < 20) return { text: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
}

export default function ManageProducts() {
  const dispatch = useDispatch();
  const { productsData, loading } = useSelector((state) => state.products);
  const [modal, setModal] = useState(null); // { type: 'delete', id } | { type: 'update', product } | null
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('highToLow');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = productsData?.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const sortedProducts = [...filteredProducts].sort((a, b) =>
    stockFilter === 'highToLow' ? b.stock - a.stock : a.stock - b.stock
  );
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const setPageOne = () => setCurrentPage(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E3B3B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 text-gray-800 bg-[#FDFBF9]">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#9E3B3B]">
              Inventory Management
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Refined Skincare & Cosmetics Catalog
            </p>
          </div>
          <Link
            to="/addProduct"
            className="px-4 sm:px-6 py-2.5 bg-[#9E3B3B] text-white font-medium rounded-lg hover:bg-[#7d2f2f] transition-all shadow-md text-center text-sm sm:text-base"
          >
            + Add Product
          </Link>
        </div>

        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={(v) => { setSearchTerm(v); setPageOne(); }}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
        /> 

        <div className="hidden md:block bg-white rounded-xl shadow-md border border-[#e5e5d1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              
              <thead className="bg-[#9E3B3B] border-b border-gray-100">
                <tr className="text-xs font-semibold text-white uppercase tracking-wider">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU/ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {currentProducts.map((product) => {
                  const status = getStockStatus(product.stock ?? 0);
                  
                  return (
                    <tr key={product.id} className="hover:bg-[#9E3B3B]/10 transition-colors">
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {(product.imageUrl || product.image) ? (
                            <img 
                              src={product.imageUrl || product.image} 
                              alt={product.name}
                              className="h-16 w-16 rounded-xl object-cover border border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-[#9E3B3B]/10 rounded-xl flex items-center justify-center text-[#9E3B3B] font-bold text-xl">
                              {product.name?.[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                        {product.id}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${status.bg} ${status.color}`}>
                          {status.text} ({product.stock})
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-lg">
                        ${product.price?.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button className="p-2 hover:bg-[#9E3B3B]/10 rounded-lg cursor-pointer transition-colors">
                            <Link to={`/products/${product.id}`}><Eye size={18} color="gray" /></Link>
                          </button>
                          <button onClick={() => setModal({ type: 'update', product })} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                            <Edit size={18} color="gray" />
                          </button>
                          <button onClick={() => setModal({ type: 'delete', id: product.id })} className="p-2 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                            <Trash2 size={18} color="gray" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>

          <div className="px-6 py-4 bg-[#FAF9F6] border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(endIndex, sortedProducts.length)}</span> of{' '}
              {sortedProducts.length}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-md text-sm transition-all ${
                      currentPage === index + 1
                        ? 'bg-[#9E3B3B] text-white shadow-sm'
                        : 'hover:bg-white text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-4">
          {currentProducts.map((product) => {
            const status = getStockStatus(product.stock ?? 0);
            return (
              <div
                key={product.id} 
                className="bg-white rounded-xl shadow-md border border-[#e5e5d1] p-4"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  {(product.imageUrl || product.image) ? (
                    <img 
                      src={product.imageUrl || product.image} 
                      alt={product.name}
                      className="h-24 w-24 rounded-xl object-cover border border-gray-200 shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="h-24 w-24 bg-[#9E3B3B]/10 rounded-xl flex items-center justify-center text-[#9E3B3B] font-bold text-2xl flex-shrink-0">
                      {product.name?.[0]}
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                    <p className="font-bold text-lg text-[#9E3B3B] mt-2">${product.price?.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-2 ${status.bg} ${status.color}`}>
                      {status.text} ({product.stock})
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link to={`/products/${product.id}`} className="p-2 hover:bg-[#9E3B3B]/10 rounded-lg transition-colors">
                    <Eye size={20} color="gray" />
                  </Link>
                  <button onClick={() => setModal({ type: 'update', product })} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                    <Edit size={20} color="gray" />
                  </button>
                  <button onClick={() => setModal({ type: 'delete', id: product.id })} className="p-2 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                    <Trash2 size={20} color="gray" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="bg-white rounded-xl shadow-md border border-[#e5e5d1] p-4">
            <p className="text-sm text-gray-600 text-center mb-3">
              Showing {startIndex + 1} - {Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length}
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      currentPage === index + 1
                        ? 'bg-[#9E3B3B] text-white shadow-sm'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>

      <PopUpDelete
        isOpen={modal?.type === 'delete'}
        onClose={() => setModal(null)}
        productDelete={modal?.type === 'delete' ? modal.id : null}
      />
      <PopUpUpdate
        isOpen={modal?.type === 'update'}
        onClose={() => setModal(null)}
        productToUpdate={modal?.type === 'update' ? modal.product : null}
      />
    </div>
  );
}
