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
  Shield,
  Truck,
  Package
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#fffaf5] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#9E3B3B]" />
              <span 
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                BeautyMatch
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Personalized skincare powered by AI. Discover products tailored to your unique skin needs.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#fffaf5] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#9E3B3B] hover:border-[#9E3B3B] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#fffaf5] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#9E3B3B] hover:border-[#9E3B3B] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#fffaf5] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#9E3B3B] hover:border-[#9E3B3B] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3">
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
              <li>
                <Link
                  to="/recommendation"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  Recommendations
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#9E3B3B] mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:hello@beautymatch.com"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  hello@beautymatch.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#9E3B3B] mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-500 hover:text-[#9E3B3B] transition-colors text-sm"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#9E3B3B] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">
                  123 Beauty Street<br />
                  Skincare City, SC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-t border-gray-100 mb-8">
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#fffaf5]">
            <Shield className="w-6 h-6 text-[#9E3B3B] mb-2" />
            <span className="text-xs font-medium text-gray-700">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#fffaf5]">
            <Truck className="w-6 h-6 text-[#9E3B3B] mb-2" />
            <span className="text-xs font-medium text-gray-700">Free Shipping</span>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#fffaf5]">
            <Package className="w-6 h-6 text-[#9E3B3B] mb-2" />
            <span className="text-xs font-medium text-gray-700">Easy Returns</span>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#fffaf5]">
            <Heart className="w-6 h-6 text-[#9E3B3B] mb-2" />
            <span className="text-xs font-medium text-gray-700">Cruelty Free</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} BeautyMatch. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-[#9E3B3B] fill-current" />
              <span>for your skin</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
