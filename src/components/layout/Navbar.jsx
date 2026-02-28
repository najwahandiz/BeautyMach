/**
 * Navbar.jsx
 *
 * Cart and admin session. Admin uses its own login (adminAuth).
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { openCart } from '../../features/cart/cartSlice';
import { selectCartQuantity } from '../../features/cart/cartSelectors';
import { isAdminLoggedIn } from '../../utils/adminAuth';

export default function Navbar() {
  // Redux
  const dispatch = useDispatch();
  const cartQuantity = useSelector(selectCartQuantity);

  // Local state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Effects: sync admin status when storage changes (e.g. login in another tab)
  useEffect(() => {
    const checkAdmin = () => setIsAdmin(isAdminLoggedIn());
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  // Handlers
  const handleOpenCart = () => {
    dispatch(openCart());
  };

  // Close mobile menu
  const closeMobile = () => setIsMobileOpen(false);

  // Navigation link styles
  const navLinkClass = ({ isActive }) => `
    relative px-1 py-2 text-sm font-medium transition-all duration-200
    ${isActive 
      ? 'text-[#9E3B3B]' 
      : 'text-gray-600 hover:text-[#9E3B3B]'
    }
  `;

  const activeIndicator = "after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-[#9E3B3B] after:rounded-full";

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img
                src="/logoB.png"
                alt="BeautyMatch Logo"
                className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#9E3B3B]/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#9E3B3B] to-[#c45858] bg-clip-text text-transparent">
              BeautyMatch
            </span>
          </Link>

          {/* ===== DESKTOP NAVIGATION ===== */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => `${navLinkClass({ isActive })} ${isActive ? activeIndicator : ''}`}
            >
              Home
            </NavLink>

            <NavLink 
              to="/catalogue" 
              className={({ isActive }) => `${navLinkClass({ isActive })} ${isActive ? activeIndicator : ''}`}
            >
              Shop
            </NavLink>

            <NavLink 
              to="/skin-quiz" 
              className={({ isActive }) => `
                ${navLinkClass({ isActive })} 
                ${isActive ? activeIndicator : ''} 
                flex items-center gap-1.5
              `}
            >
              <Sparkles size={15} className="text-[#ea7b7b]" />
              Skin Quiz
            </NavLink>
          </div>

          {/* ===== RIGHT SECTION ===== */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Shopping Cart Button with Badge */}
            <button 
              onClick={handleOpenCart}
              className="relative p-2.5 rounded-xl hover:bg-[#9E3B3B]/5 transition-colors group"
              aria-label={`Shopping cart with ${cartQuantity} items`}
            >
              <ShoppingBag size={20} className="text-gray-600 group-hover:text-[#9E3B3B] transition-colors" />
              
              {/* Cart Badge - only show if items in cart */}
              {cartQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#9E3B3B] to-[#c45858] rounded-full shadow-md shadow-[#9E3B3B]/30 animate-scaleIn">
                  {cartQuantity > 99 ? '99+' : cartQuantity}
                </span>
              )}
            </button>

            
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart Button */}
            <button
              onClick={handleOpenCart}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label={`Shopping cart with ${cartQuantity} items`}
            >
              <ShoppingBag size={22} className="text-gray-700" />
              {cartQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#9E3B3B] to-[#c45858] rounded-full">
                  {cartQuantity > 99 ? '99+' : cartQuantity}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slideDown">
          <div className="px-4 py-4 space-y-1">
            {/* Navigation Links */}
            <NavLink 
              to="/" 
              onClick={closeMobile}
              className={({ isActive }) => `
                block px-3 py-3 rounded-xl font-medium transition-colors
                ${isActive ? 'bg-[#9E3B3B]/10 text-[#9E3B3B]' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              Home
            </NavLink>

            <NavLink 
              to="/catalogue" 
              onClick={closeMobile}
              className={({ isActive }) => `
                block px-3 py-3 rounded-xl font-medium transition-colors
                ${isActive ? 'bg-[#9E3B3B]/10 text-[#9E3B3B]' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              Shop
            </NavLink>

            <NavLink 
              to="/skin-quiz" 
              onClick={closeMobile}
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-3 rounded-xl font-medium transition-colors
                ${isActive ? 'bg-[#9E3B3B]/10 text-[#9E3B3B]' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Sparkles size={18} className="text-[#ea7b7b]" />
              Skin Quiz
            </NavLink>

            {/* Admin Dashboard Link */}
            {isAdmin && (
              <NavLink 
                to="/Dashboard" 
                onClick={closeMobile}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-3 rounded-xl font-medium transition-colors
                  ${isActive ? 'bg-amber-100 text-amber-700' : 'text-amber-700 bg-amber-50 hover:bg-amber-100'}
                `}
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </NavLink>
            )}

            {/* Admin Login Link - if NOT admin */}
            {!isAdmin && (
              <NavLink 
                to="/admin-login" 
                onClick={closeMobile}
                className="flex items-center gap-2 px-3 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <LayoutDashboard size={18} />
                Admin Login
              </NavLink>
            )}
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}
