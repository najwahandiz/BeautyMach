import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'

import Home from './pages/User/Home'
import Catalogue from './pages/User/Catalogue'
import Recommendation from './pages/User/Recommendation'
import UserRoutes from './routes/UserRoutes'


import Dashboard from './pages/Admin/Dashboard'
import ManageProducts from './pages/Admin/ManageProducts'
import Orders from './pages/Admin/Orders'
import AdminRoutes from './routes/AdminRoutes'
import AddProduct from './pages/Admin/addProduct'

function App() {
  

  return (
   
      <BrowserRouter>
        <Routes>
          <Route element={<UserRoutes/>} >
            <Route path='/' element={<Home/>}></Route>
            <Route path='/catalogue' element={<Catalogue/>}></Route>
            <Route path='/recommendation' element={<Recommendation/>}></Route>
            </Route>

          <Route element={<AdminRoutes />} >
            <Route path='/manage' element={<ManageProducts/>} ></Route>
            <Route path='/Dashboard' element={<Dashboard/>} ></Route>
            <Route path="/addProduct" element={<AddProduct />}></Route>
            <Route path='/orders' element={<Orders/>} ></Route>
          </Route>

          </Routes>
        
      </BrowserRouter>
 
  )
}

export default App
