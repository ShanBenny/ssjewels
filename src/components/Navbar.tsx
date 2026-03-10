import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Sun, Moon, Search, Heart, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((state) => state.totalItems());
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jewellery', path: '/products?category=Imitation Jewellery', hasDropdown: true },
    { name: 'Sarees', path: '/products?category=Ladies Sarees', hasDropdown: true },
    { name: 'Home Decor', path: '/products?category=Small Home Items' },
    { name: 'New Arrivals', path: '/products?sort=newest' },
    { name: 'Best Sellers', path: '/products?sort=popular' },
  ];

  return (
    <>
      <nav className="bg-[var(--color-bg)] sticky top-0 z-40 shadow-sm border-b border-[var(--border-color)] transition-colors duration-300">
        {/* Top Bar - Optional for premium feel */}
        <div className="bg-[var(--color-navy)] text-white text-xs py-2 text-center font-medium tracking-wide">
          FREE SHIPPING ON ORDERS OVER ₹1000 | SECURE PAYMENTS
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-serif font-bold text-2xl">SS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl tracking-tight text-[var(--color-navy)] dark:text-[var(--color-gold)] leading-none hidden sm:block">
                  SS Imitation
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[var(--text-primary)] opacity-70 uppercase hidden sm:block mt-1">
                  Fine Jewels
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    to={link.path}
                    className={cn(
                      "text-sm font-medium uppercase tracking-wider transition-colors hover:text-[var(--color-gold)] flex items-center gap-1 py-8",
                      location.pathname === link.path || location.search.includes(link.name.split(' ')[0])
                        ? "text-[var(--color-gold)]"
                        : "text-[var(--color-navy)] dark:text-gray-200"
                    )}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-300" />}
                  </Link>
                  
                  {/* Simple Dropdown Indicator (Actual dropdown content would go here) */}
                  {link.hasDropdown && (
                    <div className="absolute top-full left-0 w-48 bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="p-4 flex flex-col gap-3">
                        <Link to={link.path} className="text-sm hover:text-[var(--color-gold)] transition-colors">All {link.name}</Link>
                        <Link to={link.path} className="text-sm hover:text-[var(--color-gold)] transition-colors">Necklaces</Link>
                        <Link to={link.path} className="text-sm hover:text-[var(--color-gold)] transition-colors">Earrings</Link>
                        <Link to={link.path} className="text-sm hover:text-[var(--color-gold)] transition-colors">Bangles</Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-5">
              <div className="relative hidden sm:block">
                {isSearchOpen ? (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    className="flex items-center border-b border-[var(--color-gold)] pb-1"
                  >
                    <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-primary)]" autoFocus onBlur={() => setIsSearchOpen(false)} />
                    <Search size={18} className="text-[var(--color-gold)]" />
                  </motion.div>
                ) : (
                  <button onClick={() => setIsSearchOpen(true)} className="p-1 text-[var(--color-navy)] dark:text-gray-200 hover:text-[var(--color-gold)] transition-colors">
                    <Search size={20} />
                  </button>
                )}
              </div>

              <button 
                onClick={toggleTheme}
                className="p-1 text-[var(--color-navy)] dark:text-gray-200 hover:text-[var(--color-gold)] transition-colors hidden sm:flex relative overflow-hidden w-8 h-8 items-center justify-center rounded-full"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>
              
              <Link to={user ? "/profile" : "/auth"} className="p-1 text-[var(--color-navy)] dark:text-gray-200 hover:text-[var(--color-gold)] transition-colors hidden sm:block relative">
                <User size={20} />
                {user && (
                   <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-[var(--color-bg)]"></span>
                )}
              </Link>

              <Link to="/wishlist" className="p-1 text-[var(--color-navy)] dark:text-gray-200 hover:text-[var(--color-gold)] transition-colors relative">
                <Heart size={20} />
              </Link>

              <button 
                onClick={() => setIsCartOpen(true)} 
                className="p-1 text-[var(--color-navy)] dark:text-gray-200 hover:text-[var(--color-gold)] transition-colors relative flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-1 text-[var(--color-navy)] dark:text-gray-200 hover:text-[var(--color-gold)] transition-colors ml-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[var(--color-bg)] border-t border-[var(--border-color)] overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                <div className="mb-4 relative">
                  <input type="text" placeholder="Search for jewellery..." className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:border-[var(--color-gold)]" />
                  <Search size={16} className="absolute left-4 top-3 text-[var(--text-primary)] opacity-50" />
                </div>
                
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-md text-base font-medium text-[var(--color-navy)] dark:text-gray-200 hover:text-[var(--color-gold)] hover:bg-[var(--card-bg)] uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="flex items-center gap-4 pt-4 mt-4 border-t border-[var(--border-color)]">
                  <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="flex items-center gap-2 text-sm text-[var(--text-primary)] opacity-80">
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Theme
                  </button>
                  <Link to={user ? "/profile" : "/auth"} onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm text-[var(--text-primary)] opacity-80">
                    <User size={18} /> Account
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
