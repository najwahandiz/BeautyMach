import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createProduct } from "../../features/products/productsThunks";
import { Upload, Package, DollarSign, ArrowLeft } from "lucide-react";
import { useToast } from "../../components/Toast";

export default function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.products);
  const { showToast } = useToast();

  const [product, setProduct] = useState({
    name: "",
    subcategory: "",
    skinType: "",
    ingredients: "",
    price: "",
    stock: "",
    minStock: "",
    description: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "skinCareProducts");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dgqoop9qz/image/upload",
        formData
      );
      setProduct({ ...product, imageUrl: res.data.secure_url });
    } catch (error) {
      console.log("Image upload error", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      minStock: Number(product.minStock),
      ingredients: product.ingredients.split(","),
    };
    dispatch(createProduct(newProduct));
    navigate("/manage");
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/manage")}
          className="flex items-center text-[#9E3B3B] font-medium mb-6 hover:underline cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Inventory
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-[#e5e5d1] overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-[#9E3B3B] p-6 text-white text-center">
            <h1 className="text-2xl font-bold tracking-tight">Add New Skincare Product</h1>
            <p className="text-white/80 text-sm mt-1">Enter the details of your premium inventory item</p>
          </div>

          <div className="p-8">
            {/* Image Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Product Image</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:border-[#9E3B3B] transition-colors group relative">
                {product.imageUrl ? (
                  <div className="relative w-full h-48">
                    <img
                      src={product.imageUrl}
                      alt="preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <label className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-[#9E3B3B] cursor-pointer hover:bg-gray-100">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer w-full">
                    <Upload className="h-12 w-12 text-gray-400 group-hover:text-[#9E3B3B] mb-2" />
                    <span className="text-gray-600 font-medium">Click to upload product image</span>
                    <span className="text-gray-400 text-xs mt-1">PNG, JPG or WebP (Max 5MB)</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Product Name" name="name" icon={<Package size={16}/>} onChange={handleChange} placeholder="e.g. Vitamin C Glow Serum" />
              
              <Select
                label="Category"
                name="subcategory"
                options={["cleansers", "moisturizers", "serums", "sunscreen"]}
                onChange={handleChange}
              />

              <Select
                label="Skin Type"
                name="skinType"
                options={["dry", "normal", "oily", "sensitive", "all types"]}
                onChange={handleChange}
              />

              <Input
                label="Price ($)"
                name="price"
                type="number"
                min="0"
                step="0.01"
                icon={<DollarSign size={16}/>}
                onChange={handleChange}
                placeholder="0.00"
              />

              <Input 
                label="Current Stock" 
                name="stock" 
                type="number"
                min="0"
                onChange={handleChange} 
                placeholder="100"
              />

              <Input
                label="Minimum Stock Warning"
                name="minStock"
                type="number"
                min="0"
                onChange={handleChange}
                placeholder="10"
              />

              <div className="md:col-span-2">
                <Input
                  label="Ingredients (comma separated)"
                  name="ingredients"
                  placeholder="Aqua, Glycerin, Niacinamide..."
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Description</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe the benefits and usage instructions..."
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#9E3B3B] focus:border-[#9E3B3B] outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-10 w-full flex justify-center items-center py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#9E3B3B] hover:bg-[#7d2f2f]"
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                "Save Product to Catalog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 🔹 Improved Reusable Components */

function Input({ label, icon, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          required
          className={`w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#9E3B3B] focus:border-[#9E3B3B] outline-none transition-all bg-white text-gray-800 ${icon ? 'pl-10' : 'pl-3'}`}
          {...props}
        />
      </div>
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <select
        required
        className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#9E3B3B] focus:border-[#9E3B3B] outline-none transition-all bg-white text-gray-800 capitalize"
        {...props}
      >
        <option value="">Select Option</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}