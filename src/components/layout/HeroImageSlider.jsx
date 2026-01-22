import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const images = ["/hero.jpg", "/hero1.jpg", "/hero3.jpg", "/hero.jpg", "/hero3.jpg", "/hero1.jpg", "/hero.jpg"];

export default function HeroImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds feels more premium/calm
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[620px] rounded-[40px] overflow-hidden shadow-2xl bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt="Natural beauty"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </AnimatePresence>
      {/* Subtle vignette overlay for professional look */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </div>
  );
}