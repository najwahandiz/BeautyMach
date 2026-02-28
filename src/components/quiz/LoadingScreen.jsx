/**
 * LoadingScreen
 *
 * Shown while the AI analyzes answers and generates recommendations.
 */

import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="text-center py-20 animate-fadeIn">
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center shadow-2xl shadow-[#9E3B3B]/30">
          <Loader2 size={42} className="text-white animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] animate-ping opacity-20" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
        Analyzing Your Skin...
      </h2>
      <p className="text-gray-500 text-lg">
        Our AI is creating your personalized routine
      </p>
      <div className="flex justify-center gap-2 mt-8">
        <div className="w-3 h-3 bg-[#9E3B3B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 bg-[#9E3B3B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 bg-[#9E3B3B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
