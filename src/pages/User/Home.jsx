/**
 * Home.jsx
 * 
 * Modern, premium home page with hero section and additional content sections.
 * Features:
 * - Hero section with AI-powered skincare messaging
 * - Features section
 * - Featured products preview
 * - Testimonials section
 * - CTA section
 * - Fully responsive
 */

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Sparkles,
  Heart,
  Shield,
  Truck,
  Package,
  Droplets,
  TrendingUp
} from "lucide-react";
import HeroImageSlider from "../../components/layout/HeroImageSlider";
import { fetchProducts } from "../../features/products/productsThunks";

export default function Home() {
  const dispatch = useDispatch();
  const { productsData } = useSelector((state) => state.products);
  
  // Fetch products on mount
  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsData]);
  
  // Get featured products (best sellers)
  const featuredProducts = productsData
    ? [...productsData]
        .filter(p => (p.quantityVendu || 0) > 0)
        .sort((a, b) => (b.quantityVendu || 0) - (a.quantityVendu || 0))
        .slice(0, 3)
    : [];

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] } 
    },
  };

  return (
    <div className="bg-gradient-to-b from-[#fffaf5] via-white to-[#fffaf5]">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-12 overflow-hidden py-20 lg:py-0">
        
        {/* Ambient background blur */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#ea7b7b]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="flex flex-col gap-8 mt-10"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="w-fit">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#9E3B3B]/10 shadow-sm text-[10px] font-bold tracking-widest text-[#9E3B3B] uppercase">
                <Sparkles size={12} className="animate-pulse" />
                AI-Powered Skincare
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Personalized skincare, <br />
              <span className="text-[#9E3B3B] italic font-medium">
                powered by science.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-gray-500 text-lg lg:text-xl max-w-md leading-relaxed"
            >
              Our AI analyzes 20+ skin markers to create a routine tailored just for you. No guesswork, just your best glow.
            </motion.p>

            {/* Action Area */}
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/skin-quiz"
                  className="flex items-center gap-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white px-8 py-4 rounded-full text-sm font-semibold hover:shadow-xl hover:shadow-[#9E3B3B]/25 transition-all active:scale-95"
                >
                  Take the Skin Quiz
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/catalogue"
                  className="px-8 py-4 rounded-full border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-white hover:border-[#9E3B3B] hover:text-[#9E3B3B] transition-all active:scale-95"
                >
                  Shop Products
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5 text-[#9E3B3B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Trusted by <span className="font-bold text-gray-900">10,000+</span> glowing users
                </p>
              </div>
            </motion.div>

            {/* Trust Footer */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-x-8 gap-y-3 pt-8 border-t border-gray-100"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <CheckCircle2 size={14} className="text-[#9E3B3B]/40" />
                Dermatologist Tested
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <CheckCircle2 size={14} className="text-[#9E3B3B]/40" />
                Cruelty Free
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="relative mt-12 mx-0"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <HeroImageSlider />
            </motion.div>
            <div className="absolute inset-0 rounded-[40px] border-2 border-[#9E3B3B]/10 translate-x-6 translate-y-6 z-0" />
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Why Choose BeautyMatch?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Experience the future of personalized skincare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-[#9E3B3B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-500">
                Advanced algorithms analyze your skin type and concerns to recommend the perfect products.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-[#9E3B3B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Ingredients</h3>
              <p className="text-gray-500">
                Carefully selected, dermatologist-tested ingredients for visible, lasting results.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-[#9E3B3B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% Authentic</h3>
              <p className="text-gray-500">
                Guaranteed authentic products with free shipping and easy returns.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      {featuredProducts.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 
                  className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Best Sellers
                </h2>
                <p className="text-gray-500">Our most loved products</p>
              </div>
              <Link
                to="/catalogue"
                className="hidden sm:flex items-center gap-2 text-[#9E3B3B] font-semibold hover:gap-3 transition-all"
              >
                View All
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#9E3B3B]/20 hover:shadow-xl transition-all"
                >
                  <Link to={`/products/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#fffaf5] to-[#fff5ee]">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-[#9E3B3B]/20" />
                        </div>
                      )}
                      {product.quantityVendu > 50 && (
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white text-xs font-semibold rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            Best Seller
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#9E3B3B] transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {product.description || 'Premium skincare for your needs'}
                      </p>
                      <p className="text-xl font-bold text-[#9E3B3B]">
                        ${product.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 text-[#9E3B3B] font-semibold"
              >
                View All Products
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-[#fffaf5] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Loved by Thousands
            </h2>
            <p className="text-gray-500 text-lg">See what our customers are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                text: "The AI recommendations were spot-on! My skin has never looked better.",
                rating: 5
              },
              {
                name: "Emma L.",
                text: "Finally found products that actually work for my sensitive skin. Highly recommend!",
                rating: 5
              },
              {
                name: "Jessica K.",
                text: "The personalized routine transformed my skincare game. Worth every penny!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex gap-1 mb-4 text-[#9E3B3B]">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="text-sm font-semibold text-gray-900">— {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-[#9E3B3B]/5 via-[#fffaf5] to-[#ea7b7b]/5 rounded-3xl p-8 sm:p-12 border border-[#9E3B3B]/10 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#9E3B3B]" />
              <span className="text-sm font-medium text-[#9E3B3B]">Ready to Start?</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Discover Your Perfect Skincare Routine
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Take our quick skin quiz and get personalized product recommendations powered by AI.
            </p>
            <Link
              to="/skin-quiz"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-bold rounded-xl shadow-xl shadow-[#9E3B3B]/25 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              Take the Skin Quiz
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
