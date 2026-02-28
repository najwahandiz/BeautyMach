/**
 * IntroScreen
 *
 * First screen users see - explains the quiz and has "Start" button.
 */

import { Sparkles, ArrowRight, Star, Droplets, ShoppingBag } from 'lucide-react';

export default function IntroScreen({ onStart }) {
  return (
    <div className="text-center animate-fadeIn">
      {/* Hero Section */}
      <div className="mb-10">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center shadow-2xl shadow-[#9E3B3B]/30 rotate-3">
            <Sparkles size={42} className="text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Star size={16} className="text-[#9E3B3B] fill-current" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Discover Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#9E3B3B] to-[#ea7b7b]">
            Perfect Routine
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
          Take our expert-designed quiz and get AI-powered skincare recommendations tailored just for you.
        </p>
      </div>

      {/* Features Card */}
      <div className="bg-white rounded-3xl p-8 mb-10 shadow-xl shadow-gray-100/50 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-6 text-lg">What you&apos;ll discover</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 bg-gradient-to-br from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-2xl border border-[#9E3B3B]/10 hover:scale-105 transition-transform">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center">
              <Droplets size={24} className="text-white" />
            </div>
            <p className="text-gray-700 font-semibold">Your Skin Type</p>
            <p className="text-sm text-gray-500 mt-1">Dry, oily, combination & more</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-2xl border border-[#9E3B3B]/10 hover:scale-105 transition-transform">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <p className="text-gray-700 font-semibold">AI Analysis</p>
            <p className="text-sm text-gray-500 mt-1">Powered by smart technology</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-2xl border border-[#9E3B3B]/10 hover:scale-105 transition-transform">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <p className="text-gray-700 font-semibold">Custom Routine</p>
            <p className="text-sm text-gray-500 mt-1">Products picked for you</p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-bold rounded-2xl shadow-xl shadow-[#9E3B3B]/30 hover:shadow-2xl hover:shadow-[#9E3B3B]/40 hover:scale-105 transition-all duration-300 text-lg"
      >
        Start Your Journey
        <ArrowRight size={22} />
      </button>
      <p className="text-gray-400 text-sm mt-5">✨ Only 5 questions • Takes 2 minutes</p>
    </div>
  );
}
