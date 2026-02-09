import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduit } from '../features/products/productsThunks';
import { X, Upload, Package, DollarSign } from 'lucide-react';
import { useToast } from './Toast';
import axios from 'axios';

export default function PopUpUpdate({ isOpen, onClose, productToUpdate }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);
  const { showToast } = useToast();

  // Form state - initialized with empty values
  const [formData, setFormData] = useState({
    name: '',
    subcategory: '',
    skinType: '',
    ingredients: '',
    price: '',
    stock: '',
    minStock: '',
    description: '',
    imageUrl: '',
  });

  // Update form when productToUpdate changes
  useEffect(() => {
    if (productToUpdate) {
      setFormData({
        name: productToUpdate.name || '',
        subcategory: productToUpdate.subcategory || '',
        skinType: productToUpdate.skinType || '',
        ingredients: Array.isArray(productToUpdate.ingredients) 
          ? productToUpdate.ingredients.join(', ') 
          : productToUpdate.ingredients || '',
        price: productToUpdate.price || '',
        stock: productToUpdate.stock || '',
        minStock: productToUpdate.minStock || '',
        description: productToUpdate.description || '',
        imageUrl: productToUpdate.imageUrl || '',
      });
    }
  }, [productToUpdate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'skinCareProducts');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dgqoop9qz/image/upload',
        data
      );
      setFormData({ ...formData, imageUrl: res.data.secure_url });
    } catch (error) {
      console.log('Image upload error', error);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedProduct = {
      id: productToUpdate.id,
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      ingredients: formData.ingredients.split(',').map((i) => i.trim()),
    };

    await dispatch(updateProduit(updatedProduct));
    onClose();
    showToast('Product updated successfully!', 'success');
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#9E3B3B] p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Update Product</h2>
            <p className="text-white/70 text-sm">Edit product information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={22} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:border-[#9E3B3B] transition-colors">
              {formData.imageUrl ? (
                <div className="relative w-full h-40">
                  <img
                    src={formData.imageUrl}
                    alt="preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <label className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-[#9E3B3B] cursor-pointer hover:bg-gray-100">
                    Change
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer py-4">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-gray-600 font-medium text-sm">Click to upload</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Product Name */}
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Vitamin C Serum"
              icon={<Package size={16} />}
            />

            {/* Category */}
            <Select
              label="Category"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              options={['cleanser', 'moisturizer', 'serum', 'sunscreen']}
            />

            {/* Skin Type */}
            <Select
              label="Skin Type"
              name="skinType"
              value={formData.skinType}
              onChange={handleChange}
              options={['dry', 'normal', 'oily', 'sensitive', 'combination', 'all types']}
            />

            {/* Price */}
            <Input
              label="Price ($)"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              icon={<DollarSign size={16} />}
            />

            {/* Stock */}
            <Input
              label="Current Stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="100"
            />

            {/* Min Stock */}
            <Input
              label="Min Stock Warning"
              name="minStock"
              type="number"
              min="0"
              value={formData.minStock}
              onChange={handleChange}
              placeholder="10"
            />

            {/* Ingredients - Full Width */}
            <div className="md:col-span-2">
              <Input
                label="Ingredients (comma separated)"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Aqua, Glycerin, Niacinamide..."
              />
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#9E3B3B] focus:border-[#9E3B3B] outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 rounded-xl text-white font-semibold transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9E3B3B] hover:bg-[#7d2f2f]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Reusable Input Component */
function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          required
          className={`w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#9E3B3B] focus:border-[#9E3B3B] outline-none transition-all ${
            icon ? 'pl-10' : 'pl-3'
          }`}
          {...props}
        />
      </div>
    </div>
  );
}

/* Reusable Select Component */
function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <select
        required
        className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#9E3B3B] focus:border-[#9E3B3B] outline-none transition-all capitalize"
        {...props}
      >
        <option value="">Select Option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
