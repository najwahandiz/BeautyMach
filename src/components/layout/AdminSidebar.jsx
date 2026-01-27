/**
 * AdminSidebar.jsx
 * 
 * Admin dashboard sidebar with navigation and logout.
 * Includes responsive mobile menu.
 */

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Eye, 
  Menu, 
  X, 
  LogOut,
  Shield
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar on mobile
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  // Close sidebar when clicking a link (mobile)
  const closeSidebar = () => setIsOpen(false);

  /**
   * Handle admin logout
   * - Remove 'isAdmin' from localStorage
   * - Redirect to home page
   */
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  // Navigation link style function
  const linkClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
    ${isActive
      ? "bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white shadow-md"
      : "text-gray-600 hover:bg-gray-100"
    }
  `;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed h-screen w-64 bg-white border-r border-gray-100 flex flex-col justify-between z-50
          transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* TOP SECTION */}
        <div>
          {/* Brand Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src="/logoB.png"
                alt="BeautyMatch Logo"
                className="w-9 h-9"
              />
              <div>
                <span className="text-lg font-bold text-gray-800 block">
                  BeautyMatch
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Shield size={10} />
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 px-4 space-y-2">
            <NavLink
              to="/Dashboard"
              onClick={closeSidebar}
              className={linkClass}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink
              to="/manage"
              onClick={closeSidebar}
              className={linkClass}
            >
              <Package size={20} />
              <span className="font-medium">Products</span>
            </NavLink>

            <NavLink
              to="/orders"
              onClick={closeSidebar}
              className={linkClass}
            >
              <ShoppingCart size={20} />
              <span className="font-medium">Orders</span>
            </NavLink>
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="px-4 pb-6 space-y-2">
          {/* View Store Link */}
          <NavLink
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[#9E3B3B] hover:bg-[#9E3B3B]/5 rounded-xl transition-colors"
          >
            <Eye size={20} />
            <span className="font-medium">View Store</span>
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>

          {/* Admin info */}
          <div className="mt-4 px-4 py-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Admin</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
