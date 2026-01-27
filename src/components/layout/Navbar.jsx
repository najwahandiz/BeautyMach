/**
 * Navbar.jsx
 * 
 * Modern, responsive navigation bar for BeautyMatch.
 * Features: Profile dropdown, shopping cart, skin quiz link
 * Admin Dashboard link only shows if admin is logged in.
 */

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Sparkles, 
  Menu, 
  X, 
  LogOut, 
  Heart,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { selectIsLoggedIn, selectUserProfile } from '../../features/user/userSlice';
import { logoutUser } from '../../features/user/userThunks';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user state from Redux (for user profile)
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const profile = useSelector(selectUserProfile);
  
  // Check if admin is logged in (from localStorage)
  // This is separate from user login!
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Mobile menu state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Profile dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Ref for dropdown to detect outside clicks
  const dropdownRef = useRef(null);

  // Check admin status on mount and when localStorage changes
  useEffect(() => {
    const checkAdmin = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    };
    
    // Check on mount
    checkAdmin();
    
    // Listen for storage changes (in case admin logs in/out in another tab)
    window.addEventListener('storage', checkAdmin);
    
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle user logout (from Redux)
  const handleLogout = () => {
    dispatch(logoutUser());
    setIsProfileOpen(false);
    navigate('/');
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
            
            {/* Shopping Cart */}
            <button className="relative p-2.5 rounded-xl hover:bg-[#9E3B3B]/5 transition-colors group">
              <ShoppingBag size={20} className="text-gray-600 group-hover:text-[#9E3B3B] transition-colors" />
            </button>

            {/* Profile Button / Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
                  ${isProfileOpen 
                    ? 'bg-[#9E3B3B]/10 text-[#9E3B3B]' 
                    : 'hover:bg-[#9E3B3B]/5 text-gray-600 hover:text-[#9E3B3B]'
                  }
                `}
              >
                {isLoggedIn ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center text-white font-semibold text-sm">
                      {profile?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {profile?.name || 'User'}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} 
                    />
                  </>
                ) : (
                  <>
                    <User size={20} />
                    <span className="text-sm font-medium">Sign In</span>
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fadeIn overflow-hidden">
                  {isLoggedIn ? (
                    <>
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{profile?.name}</p>
                        <p className="text-sm text-gray-500">{profile?.email || 'Beauty enthusiast'}</p>
                      </div>
                      
                      {/* Menu items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#9E3B3B]/5 hover:text-[#9E3B3B] transition-colors"
                        >
                          <User size={18} />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/skin-quiz"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#9E3B3B]/5 hover:text-[#9E3B3B] transition-colors"
                        >
                          <Sparkles size={18} />
                          <span>My Skin Analysis</span>
                        </Link>
                        
                        <Link
                          to="/catalogue"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#9E3B3B]/5 hover:text-[#9E3B3B] transition-colors"
                        >
                          <Heart size={18} />
                          <span>Wishlist</span>
                        </Link>
                      </div>
                      
                      {/* Admin Dashboard Link - ONLY if admin is logged in */}
                      {isAdmin && (
                        <div className="border-t border-gray-100 py-2">
                          <Link
                            to="/Dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                          >
                            <LayoutDashboard size={18} />
                            <span className="font-medium">Admin Dashboard</span>
                          </Link>
                        </div>
                      )}
                      
                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Sign in prompt */}
                      <div className="px-4 py-3 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center">
                          <User size={24} className="text-[#9E3B3B]" />
                        </div>
                        <p className="text-gray-800 font-medium mb-1">Welcome to BeautyMatch</p>
                        <p className="text-sm text-gray-500 mb-4">Sign in to access your profile</p>
                        
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="block w-full py-2.5 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#9E3B3B]/25 transition-all"
                        >
                          Sign In / Create Profile
                        </Link>
                      </div>
                      
                      {/* Admin Login Link - for guests to access admin */}
                      <div className="border-t border-gray-100 py-2">
                        <Link
                          to="/admin-login"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          <span>Admin Login</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
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

      {/* ===== MOBILE MENU ===== */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slideDown">
          <div className="px-4 py-4 space-y-1">
            
            {/* User info (if logged in) */}
            {isLoggedIn && (
              <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-gradient-to-r from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center text-white font-semibold">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{profile?.name}</p>
                  <p className="text-sm text-gray-500">View Profile</p>
                </div>
              </div>
            )}

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

            <NavLink 
              to="/profile" 
              onClick={closeMobile}
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-3 rounded-xl font-medium transition-colors
                ${isActive ? 'bg-[#9E3B3B]/10 text-[#9E3B3B]' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <User size={18} />
              {isLoggedIn ? 'My Profile' : 'Sign In'}
            </NavLink>

            {/* Admin Dashboard Link - ONLY if admin is logged in */}
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

            {/* Cart & Logout */}
            <div className="flex items-center gap-3 pt-3 mt-3 border-t border-gray-100">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                <ShoppingBag size={18} />
                Cart
              </button>
              
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMobile();
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}
