import React from 'react'
import { Outlet } from "react-router-dom";
import AdminSidebar from '../components/layout/AdminSidebar';



export default function AdminRoutes() {
  return (
    <div >
        <AdminSidebar/>
        <main>
            <Outlet/>
        </main>
    </div>
  )
}
