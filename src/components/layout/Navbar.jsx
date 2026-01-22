import React, { useState } from 'react'
import { User, ShoppingBag, Sparkles, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar ()  {
  // Mobile menu state
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#fdfcfb] border-b border-gray-100 px-6 py-4">
      
      {/* TOP BAR */}
      <div className="flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer">
            <img
                src="/logoB.png"
                alt="BeautyMatch Logo"
                className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">
                BeautyMatch
            </span>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link to={"/"} className="relative text-[#a34444] font-medium pb-1 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#a34444]">
            Home
          </Link>

          <Link to={"/catalogue"} className="flex items-center gap-1.5 text-gray-500 hover:text-red-800 transition ">
            Shop
          </Link>

          <Link to={"/recommendation"} className="flex items-center gap-1.5 text-gray-500 hover:text-red-800 transition">
            <Sparkles size={16} />
            Skin Quiz
          </Link>

          
        </div>

        {/* RIGHT ICONS */}
        <div className="hidden md:flex items-center gap-6 text-gray-700  ">
          <Link to={"/Dashboard"}>  
            <User size={22} color='#9E3B3B'/>
          </Link>
          
          <ShoppingBag size={22} color='#9E3B3B'/>
        </div>
        

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 text-gray-700">
          <Link to={"/"} className="block font-medium text-[#a34444]">Home</Link>
          <Link to={"/catalogue"} className="block">Shop</Link>
          <Link to={"/recommendation"} className="flex items-center gap-2">
            <Sparkles size={16} />
            Skin Quiz
          </Link>
          

          <div className="flex gap-6 pt-4 border-t">
            <Link to={"/Dashboard"}>  
             <User size={22} />
            </Link>
            <ShoppingBag size={22} />
          </div>
        </div>
      )}

    </nav>
  )
}


