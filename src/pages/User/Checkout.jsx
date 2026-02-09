/**
 * Checkout.jsx
 * 
 * Modern, premium checkout page with shipping form and order summary.
 * 
 * Features:
 * - Two-column layout (desktop) / Single-column (mobile)
 * - Shipping information form
 * - Order summary with cart items
 * - Form validation
 * - Order confirmation with success animation
 * - Clears cart after confirmation
 * 
 * NOTE: This is a frontend-only checkout simulation.
 * Backend integration (n8n) can be added later.
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle2, 
  Package, 
  Truck,
  Sparkles,
  Lock
} from 'lucide-react';
import { selectCartItems, selectCartTotal } from '../../features/cart/cartSelectors';
import { clearCart } from '../../features/cart/cartSlice';
import { useToast } from '../../components/Toast';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Get cart data from Redux
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const shipping = 0; // Always free
  const total = subtotal + shipping;
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    message: ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Order confirmation state
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle order confirmation
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      navigate('/catalogue');
      return;
    }
    
    // TODO: Here you can add n8n integration later
    // Example: await sendOrderToN8N({ formData, cartItems, total });
    
    // Show success state
    setIsConfirmed(true);
    
    // Clear cart after a short delay
    setTimeout(() => {
      dispatch(clearCart());
      showToast('Order confirmed successfully!', 'success');
    }, 500);
  };
  
  // Redirect if cart is empty
  if (cartItems.length === 0 && !isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center">
            <Package className="w-12 h-12 text-[#9E3B3B]/40" />
          </div>
          <h1 
            className="text-3xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-8">
            Add some products to your cart before checkout.
          </p>
          <button
            onClick={() => navigate('/catalogue')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  // Success confirmation view
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          {/* Success Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Animated circle */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl animate-scale-in">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
            </div>
          </div>
          
          {/* Success Message */}
          <h1 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 animate-fade-in"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg mb-2 animate-fade-in-delay">
            Thank you for your purchase, <span className="font-semibold text-[#9E3B3B]">{formData.firstName}</span>!
          </p>
          <p className="text-gray-500 mb-8 animate-fade-in-delay-2">
            We've sent a confirmation email to <span className="font-medium">{formData.email}</span>
          </p>
             
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/catalogue')}
              className="px-8 py-3 bg-white border-2 border-[#9E3B3B] text-[#9E3B3B] font-semibold rounded-xl hover:bg-[#9E3B3B] hover:text-white transition-all"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="px-8 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              View Profile
            </button>
          </div>
        </div>
        
        {/* Success Animation Styles */}
        <style>{`
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.5);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-scale-in {
            animation: scale-in 0.5s ease-out forwards;
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          
          .animate-fade-in-delay {
            animation: fade-in 0.6s ease-out 0.2s forwards;
            opacity: 0;
          }
          
          .animate-fade-in-delay-2 {
            animation: fade-in 0.6s ease-out 0.4s forwards;
            opacity: 0;
          }
          
          .animate-fade-in-delay-3 {
            animation: fade-in 0.6s ease-out 0.6s forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }
  
  // Main checkout view
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#9E3B3B]/10 mb-4">
            <Lock className="w-4 h-4 text-[#9E3B3B]" />
            <span className="text-sm font-medium text-[#9E3B3B]">Secure Checkout</span>
          </div>
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Secure Checkout
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Your transaction is secure and encrypted. We never store your payment information.
          </p>
        </div>
        
        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT: Shipping Information Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-[#9E3B3B]" />
                <h2 
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Shipping Information
                </h2>
              </div>
              
              <form onSubmit={handleConfirmOrder} className="space-y-5">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-[#9E3B3B]">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.firstName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10'
                    } outline-none`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-[#9E3B3B]">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.lastName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10'
                    } outline-none`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-[#9E3B3B]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10'
                    } outline-none`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-[#9E3B3B]">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.city 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10'
                    } outline-none`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
                
                {/* Message (Optional) */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10 outline-none transition-all resize-none"
                    placeholder="Any special instructions or notes..."
                  />
                </div>
              </form>
            </div>
          </div>
          
          {/* RIGHT: Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-[#9E3B3B]" />
                <h2 
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Order Summary
                </h2>
              </div>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#fffaf5] to-[#fff5ee] border border-gray-100">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-[#9E3B3B]/20" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-[#9E3B3B]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 pt-6 border-t border-gray-200 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Shipping
                  </span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#9E3B3B]">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Security Badge */}
              <div className="flex items-center gap-2 p-3 bg-[#fffaf5] rounded-xl mb-6">
                <Shield className="w-5 h-5 text-[#9E3B3B]" />
                <span className="text-xs text-gray-600">
                  Your payment information is secure and encrypted
                </span>
              </div>
              
              {/* Confirm Order Button */}
              <button
                onClick={handleConfirmOrder}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white text-lg font-semibold rounded-2xl shadow-xl shadow-[#9E3B3B]/25 hover:shadow-2xl hover:shadow-[#9E3B3B]/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
              >
                <Lock className="w-5 h-5" />
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
