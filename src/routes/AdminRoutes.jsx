import React from 'react'
import { Outlet } from "react-router-dom";
import AdminSidebar from '../components/layout/AdminSidebar';

export default function AdminRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - position fixed */}
        <AdminSidebar />
        
        {/* Main content avec padding-left pour sidebar */}
        <main className="flex-1 ml-64 min-h-screen">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}