import { useDispatch } from 'react-redux';
import { deleteProduct } from '../features/products/productsThunks';
import { useToast } from './Toast';

export default function PopUpDelete({ isOpen, onClose, productDelete }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleDelete = async () => {
    await dispatch(deleteProduct(productDelete));
    onClose();
    showToast('Product deleted successfully!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#0f172a] mb-3">Delete Product</h2>
          <p className="text-[#64748b] leading-relaxed">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 text-[#0f172a] font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2.5 rounded-xl bg-[#f43f5e] text-white font-semibold hover:bg-[#e11d48] transition-colors shadow-lg shadow-rose-100 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
