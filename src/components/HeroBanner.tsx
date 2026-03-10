import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1599643478514-4a4840e69888?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1610189014029-79a022b4eb14?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000',
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full relative bg-gray-900">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={HERO_IMAGES[currentIndex]}
          alt="Hero Background"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
    </div>
  );
}
