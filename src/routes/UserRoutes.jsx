/**
 * UserRoutes.jsx
 * 
 * Layout wrapper for all user-facing pages.
 * Includes Navbar, Footer, and Cart Sidebar.
 * 
 * The CartSidebar is rendered here so it's available on ALL pages.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartSidebar from '../components/cart/CartSidebar';

export default function UserRoutes() {
  return (
    <div>
      {/* Navigation Bar - fixed at top */}
      <Navbar />
      
      {/* Page Content */}
      <main>
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Cart Sidebar - rendered on all pages, controlled by Redux */}
      <CartSidebar />
    </div>
  );
}
