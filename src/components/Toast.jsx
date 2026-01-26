import { createContext, useContext, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

// Create Context
const ToastContext = createContext();

// Hook to use toast
export const useToast = () => useContext(ToastContext);

// Toast Provider - wrap your app with this
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Hide toast function
  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Component */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <CheckCircle size={20} className={toast.type === 'success' ? 'text-green-500' : 'text-red-500'} />
            <span className="font-medium">{toast.message}</span>
            <button 
              onClick={hideToast}
              className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}


