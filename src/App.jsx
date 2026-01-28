import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// User pages
import Home from './pages/User/Home'
import Catalogue from './pages/User/Catalogue'
import ProductDetails from './pages/User/ProductDetails'
import Recommendation from './pages/User/Recommendation'
import SkinQuiz from './pages/User/SkinQuiz'
import Profile from './pages/User/Profile'
import UserRoutes from './routes/UserRoutes'

// Admin pages
import Dashboard from './pages/Admin/Dashboard'
import ManageProducts from './pages/Admin/ManageProducts'
import Orders from './pages/Admin/Orders'
import AdminRoutes from './routes/AdminRoutes'
import AddProduct from './pages/Admin/addProduct'
import AdminLogin from './pages/Admin/AdminLogin'

// User thunk - load user data on app start
import { loadUserFromStorage } from './features/user/userThunks'

function App() {
  const dispatch = useDispatch();

  // Load user data from localStorage on app start
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login - standalone page (no navbar/footer) */}
        <Route path='/admin-login' element={<AdminLogin />} />

        {/* User Routes - with navbar and footer */}
        <Route element={<UserRoutes/>}>
          <Route path='/' element={<Home/>} />
          <Route path='/catalogue' element={<Catalogue/>} />
          <Route path='/products/:id' element={<ProductDetails/>} />
          <Route path='/recommendation' element={<Recommendation/>} />
          <Route path='/skin-quiz' element={<SkinQuiz/>} />
          <Route path='/profile' element={<Profile/>} />
        </Route>

        {/* Admin Routes - protected, requires admin login */}
        <Route element={<AdminRoutes/>}>
          <Route path='/manage' element={<ManageProducts/>} />
          <Route path='/Dashboard' element={<Dashboard/>} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path='/orders' element={<Orders/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
