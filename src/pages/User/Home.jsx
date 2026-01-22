import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Sparkles } from "lucide-react";
import HeroImageSlider from "../../components/layout/HeroImageSlider";

export default function Home() {
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
    <section className="relative bg-[#FCFBF9] min-h-screen flex items-center px-6 lg:px-16 overflow-hidden py-20 lg:py-0">
      
      {/* Ambient background blur */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#e28e8e]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="flex flex-col gap-8 mt-10"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="w-fit">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#913a3a]/10 shadow-sm text-[10px] font-bold tracking-widest text-[#913a3a] uppercase">
              <Sparkles size={12} className="animate-pulse" />
              AI-Powered Skincare
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl lg:text-6xl font-serif text-[#2D1B1B] leading-[1.1] tracking-tight"
          >
            Personalized skincare, <br />
            <span className="text-[#e28e8e] italic font-medium">
              powered by science.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-gray-500 text-lg lg:text-xl max-w-md leading-relaxed font-light"
          >
            Our AI analyzes 20+ skin markers to create a routine tailored just for you. No guesswork, just your best glow.
          </motion.p>

          {/* Action Area */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 bg-[#913a3a] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#7a3131] hover:shadow-xl hover:shadow-[#913a3a]/20 transition-all active:scale-95">
                Take the Skin Quiz
                <ArrowRight size={18} />
              </button>

              <button className="px-8 py-4 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-white hover:border-gray-300 transition-all active:scale-95">
                Shop Products
              </button>
            </div>

            {/* Social Proof Inline */}
            <div className="flex items-center gap-4">
              <div className="flex gap-0.5 text-[#913a3a]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-gray-500 font-light">
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
              <CheckCircle2 size={14} className="text-[#913a3a]/40" />
              Dermatologist Tested
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <CheckCircle2 size={14} className="text-[#913a3a]/40" />
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
          {/* Main Animated Container */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <HeroImageSlider />
            
            {/* Floating Info Card (Optional Polish) */}
            {/* <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3 animate-bounce-slow">
               <div className="w-10 h-10 bg-[#e28e8e]/20 rounded-full flex items-center justify-center text-[#e28e8e]">
                  <Sparkles size={20} />
               </div>
               <div className="pr-4">
                  <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">AI Match</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">98% Accuracy</p>
               </div>
            </div> */}
          </motion.div>

          {/* Aesthetic Background Frame */}
          <div className="absolute inset-0 rounded-[40px] border-2 border-[#e28e8e]/10 translate-x-6 translate-y-6 z-0" />
        </motion.div>

      </div>
    </section>
  );
}