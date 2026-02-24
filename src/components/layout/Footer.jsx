/**
 * Footer.jsx
 * 
 * Modern, premium footer component for BeautyMatch.
 * Features:
 * - Company information
 * - Quick links
 * - Social media links
 * - Newsletter signup (optional)
 * - Trust badges
 * - Responsive design
 */

import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Heart,
  Truck,
  Package,
  HandCoins
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#9E3B3B]/10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-12 lg:py-16">
        
        {/* Main Footer Content - mobile: 1 col, sm: 2 cols, lg: 4 cols */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 sm:gap-8 sm:mb-10 lg:grid-cols-4 lg:gap-12 lg:mb-12">
          
          {/* Trust Badges - 2x2 grid, compact on mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            <div className="flex flex-col items-center justify-center text-center p-3 rounded-lg sm:p-4 sm:rounded-xl bg-[#fffaf5] border border-gray-200">
              <HandCoins className="w-5 h-5 text-[#9E3B3B] mb-1.5 sm:w-6 sm:h-6 sm:mb-2" />
              <span className="text-[10px] font-medium text-gray-700 leading-tight sm:text-xs">Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-3 rounded-lg sm:p-4 sm:rounded-xl bg-[#fffaf5] border border-gray-200">
              <Truck className="w-5 h-5 text-[#9E3B3B] mb-1.5 sm:w-6 sm:h-6 sm:mb-2" />
              <span className="text-[10px] font-medium text-gray-700 leading-tight sm:text-xs">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-3 rounded-lg sm:p-4 sm:rounded-xl bg-[#fffaf5] border border-gray-200">
              <Package className="w-5 h-5 text-[#9E3B3B] mb-1.5 sm:w-6 sm:h-6 sm:mb-2" />
              <span className="text-[10px] font-medium text-gray-700 leading-tight sm:text-xs">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-3 rounded-lg sm:p-4 sm:rounded-xl bg-[#fffaf5] border border-gray-200">
              <Heart className="w-5 h-5 text-[#9E3B3B] mb-1.5 sm:w-6 sm:h-6 sm:mb-2" />
              <span className="text-[10px] font-medium text-gray-700 leading-tight sm:text-xs">Cruelty Free</span>
            </div>
          </div>

          {/* Brand Column */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#9E3B3B] sm:w-6 sm:h-6" />
              <span 
                className="text-xl font-bold text-gray-900 sm:text-2xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                BeautyMatch
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Personalized skincare powered by AI. Discover products tailored to your unique skin needs.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1 sm:gap-3 sm:pt-2">
              <a
                href="https://www.instagram.com/beautymarket_ma/ " target="_blank"
                className="w-8 h-8 rounded-lg bg-[#fffaf5] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#9E3B3B] hover:border-[#9E3B3B] transition-all sm:w-9 sm:h-9"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://www.instagram.com/beautymarket_ma/ " target="_blank"
                className="w-8 h-8 rounded-lg bg-[#fffaf5] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#9E3B3B] hover:border-[#9E3B3B] transition-all sm:w-9 sm:h-9"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://www.instagram.com/beautymarket_ma/ " target="_blank"
                className="w-8 h-8 rounded-lg bg-[#fffaf5] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#9E3B3B] hover:border-[#9E3B3B] transition-all sm:w-9 sm:h-9"
                aria-label="Twitter"
              >
                <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links - no extra padding on mobile */}
          <div className="px-0 lg:px-10">
            <h3 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wide sm:mb-4 sm:text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/skin-quiz"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  Skin Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wide sm:mb-4 sm:text-sm">
              Contact
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-3.5 h-3.5 text-[#9E3B3B] mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <a
                  href="mailto:hello@beautymatch.com"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm break-all"
                >
                  hello@beautymatch.com
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-3.5 h-3.5 text-[#9E3B3B] mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-3.5 h-3.5 text-[#9E3B3B] mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="text-gray-500 text-sm">
                  123 Beauty Street<br />
                  Skincare City, SC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - stacked on mobile, row on sm+ */}
        <div className="pt-6 border-t border-gray-100 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
            <p className="text-xs text-gray-500 text-center sm:text-left sm:text-sm order-2 sm:order-1">
              © {new Date().getFullYear()} BeautyMatch. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 order-1 sm:order-2 sm:text-sm">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#9E3B3B] fill-current sm:w-4 sm:h-4" />
              <span>for your skin</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
