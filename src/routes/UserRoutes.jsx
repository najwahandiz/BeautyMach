import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function UserRoutes() {
  return (
    <div>
        <Navbar/>
        <main>
            <Outlet />
        </main>
        <Footer/>
    </div>
  )
}
