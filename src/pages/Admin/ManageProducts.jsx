import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsThunks';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import PopUpDelete from '../../components/popUpDelete';
import PopUpUpdate from '../../components/PopUpUpdate';
import ProductFilters from '../../features/products/ProductFilters';

export default function ManageProducts() {
  const dispatch = useDispatch();
  
  // Get products data from Redux store
  const { productsData, loading } = useSelector((state) => state.products);

  // Delete popup state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  //update popup state
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('highToLow');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Fetch products when component loads
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get unique categories from products
  const categories = ['All', ...new Set(productsData?.map((p) => p.category) || [])];

  // Filter products by search and category
  const filteredProducts = productsData?.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Sort products by stock
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (stockFilter === 'highToLow') {
      return b.stock - a.stock;
    }
    return a.stock - b.stock;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Handle delete button click
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteOpen(true);
  };

  // Handle update button click
  const handleUpdateClick = (product) => {
    setProductToUpdate(product);
    setIsUpdateOpen(true);
  };

  // Get stock status color and text
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };
    }
    if (stock < 20) {
      return { text: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-50' };
    }
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E3B3B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#9E3B3B]">
              Inventory Management
            </h1>
            <p className="text-gray-600 mt-1">
              Refined Skincare & Cosmetics Catalog
            </p>
          </div>
          <Link
            to="/addProduct"
            className="px-6 py-2.5 bg-[#9E3B3B] text-white font-medium rounded-lg hover:bg-[#7d2f2f] transition-all shadow-md text-center"
          >
            + Add Product
          </Link>
        </div>

        {/* Filters Section (uncomment to enable) */}
        
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          categories={categories}
        /> 
       

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-md border border-[#e5e5d1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              
              {/* Table Header */}
              <thead className="bg-[#FAF9F6] border-b border-gray-100">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU/ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-50">
                {currentProducts.map((product) => {
                  const status = getStockStatus(product.stock || 0);
                  
                  return (
                    <tr key={product.id} className="hover:bg-orange-50/30 transition-colors">
                      
                      {/* Product Name & Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[#9E3B3B]/10 rounded flex items-center justify-center text-[#9E3B3B] font-bold">
                            {product.name?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>

                      {/* Product ID */}
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                        {product.id}
                      </td>

                      {/* Stock Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${status.bg} ${status.color}`}>
                          {status.text} ({product.stock})
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-semibold">
                        ${product.price?.toFixed(2)}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button className="p-1.5 hover:bg-[#9E3B3B]/10 rounded cursor-pointer">
                            <Eye size={18} color="gray" />
                          </button>
                          <button 
                            onClick={() => handleUpdateClick(product)}
                            className="p-1.5 hover:bg-gray-100 rounded cursor-pointer"
                          >
                            <Edit size={18} color="gray" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-red-50 rounded cursor-pointer"
                            onClick={() => handleDeleteClick(product.id)}
                          >
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

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-[#FAF9F6] border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(endIndex, sortedProducts.length)}</span> of{' '}
              {sortedProducts.length}
            </p>

            <div className="flex gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
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

              {/* Next Button */}
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
      </div>

      {/* Delete Confirmation Popup */}
      <PopUpDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        productDelete={productToDelete}
      />
      {/* Update Confirmation Popup */}

      <PopUpUpdate
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        productToUpdate={productToUpdate}
      />

    </div>
  );
}
