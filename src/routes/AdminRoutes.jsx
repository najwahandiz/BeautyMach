/**
 * AdminRoutes.jsx
 * 
 * Protected admin routes wrapper.
 * Checks if user is logged in as admin before allowing access.
 * 
 * How it works:
 * 1. Check localStorage for 'isAdmin' key
 * 2. If 'isAdmin' is 'true' → show admin dashboard
 * 3. If not → redirect to admin login page
 */

import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from '../components/layout/AdminSidebar';

export default function AdminRoutes() {
  // Check if admin is logged in
  // localStorage stores strings, so we compare with "true"
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // If NOT admin, redirect to login page
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  // If admin, show the dashboard with sidebar
  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      {/* Main content area */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
