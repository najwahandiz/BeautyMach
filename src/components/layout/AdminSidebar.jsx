import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Eye } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col justify-between">
      
      {/* TOP SECTION */}
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b">
          {/* Logo */}
          <img
            src="/logoB.png" 
            alt="BeautyMatch Logo"
            className="w-8 h-8"
          />
          <span className="text-lg font-semibold text-gray-800">
            BeautyMatch
          </span>
        </div>

        {/* Menu */}
        <nav className="mt-6 px-4 space-y-2">
          
          <NavLink
            to="/Dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition 
              ${isActive 
                ? "bg-[#9E3B3B] text-white" 
                : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/manage"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition 
              ${isActive 
                ? "bg-[#9E3B3B] text-white" 
                : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Package size={18} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition 
              ${isActive 
                ? "bg-[#9E3B3B] text-white" 
                : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <ShoppingCart size={18} />
            <span>Orders</span>
          </NavLink>

        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="px-6 py-4 border-t">
        <NavLink
          to="/"
          className="flex items-center gap-3 text-gray-600 hover:text-[#9E3B3B] transition"
        >
          <Eye size={18} />
          <span>View Store</span>
        </NavLink>
      </div>

    </aside>
  );
}
