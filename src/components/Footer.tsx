import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white py-16 border-t border-[#222222] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] rounded-sm flex items-center justify-center shadow-lg shadow-gold-900/20">
              <span className="text-[#111111] font-serif font-bold text-2xl">SS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl tracking-wide text-white leading-none">
                Imitation
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--color-gold)] mt-1">
                Jewels
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-400 font-light leading-relaxed max-w-xs">
            Your one-stop destination for premium imitation jewellery, elegant ladies sarees, and beautiful home decor items.
          </p>
          <div className="flex space-x-5 pt-2">
            <a href="#" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors"><Facebook size={20} strokeWidth={1.5} /></a>
            <a href="#" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
            <a href="#" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors"><Twitter size={20} strokeWidth={1.5} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-serif font-bold mb-6 uppercase tracking-widest text-sm">Shop</h3>
          <ul className="space-y-4 text-sm text-gray-400 font-light">
            <li><Link to="/products?category=Imitation Jewellery" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-[var(--color-gold)] rounded-full opacity-0 -ml-3 transition-all"></span>Imitation Jewellery</Link></li>
            <li><Link to="/products?category=Ladies Sarees" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-[var(--color-gold)] rounded-full opacity-0 -ml-3 transition-all"></span>Ladies Sarees</Link></li>
            <li><Link to="/products?category=Small Home Items" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-[var(--color-gold)] rounded-full opacity-0 -ml-3 transition-all"></span>Home Decor</Link></li>
            <li><Link to="/products" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-[var(--color-gold)] rounded-full opacity-0 -ml-3 transition-all"></span>All Products</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-serif font-bold mb-6 uppercase tracking-widest text-sm">Customer Care</h3>
          <ul className="space-y-4 text-sm text-gray-400 font-light">
            <li><Link to="/contact" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-[var(--color-gold)] rounded-full opacity-0 -ml-3 transition-all"></span>Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-[var(--color-gold)] rounded-full opacity-0 -ml-3 transition-all"></span>FAQs</Link></li>
            <li><Link to="/shipping" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-[var(--color-gold)] rounded-full opacity-0 -ml-3 transition-all"></span>Shipping & Returns</Link></li>
            <li><Link to="/terms" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-[var(--color-gold)] rounded-full opacity-0 -ml-3 transition-all"></span>Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-serif font-bold mb-6 uppercase tracking-widest text-sm">Contact Us</h3>
          <ul className="space-y-5 text-sm text-gray-400 font-light">
            <li className="flex items-start gap-4 group">
              <MapPin size={20} className="text-[var(--color-gold)] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="leading-relaxed">Nelamangala<br />Bangalore, Karnataka</span>
            </li>
            <li className="flex items-center gap-4 group">
              <Phone size={20} className="text-[var(--color-gold)] shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span>+91 9480605113</span>
            </li>
            <li className="flex items-center gap-4 group">
              <Mail size={20} className="text-[var(--color-gold)] shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <a href="mailto:support@ssjewels.com" className="hover:text-[var(--color-gold)] transition-colors">support@ssjewels.com</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#222222] text-xs text-center text-gray-500 font-light flex flex-col md:flex-row justify-between items-center uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} SS Imitation Jewels. All rights reserved.</p>
        <div className="flex space-x-6 mt-6 md:mt-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
        </div>
      </div>
    </footer>
  );
}
