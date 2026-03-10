import { motion, AnimatePresence } from 'motion/react';

interface GlobalLoaderProps {
  isOpen: boolean;
  message?: string;
}

export default function GlobalLoader({ isOpen, message = 'Loading...' }: GlobalLoaderProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="w-16 h-16 border-4 border-white/20 border-t-[var(--color-gold)] rounded-full animate-spin mb-6"></div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--color-gold)] font-serif text-xl md:text-2xl tracking-wider text-center px-4"
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
