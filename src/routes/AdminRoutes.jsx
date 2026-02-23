/**
 * AdminRoutes.jsx
 *
 * Protected admin routes. Not related to user profile.
 * - Access only if admin has logged in with correct username/password.
 * - Uses admin session only; never checks user profile or Redux user state.
 */

import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from '../components/layout/AdminSidebar';
import { isAdminLoggedIn } from '../utils/adminAuth';

export default function AdminRoutes() {
  if (!isAdminLoggedIn()) {
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
