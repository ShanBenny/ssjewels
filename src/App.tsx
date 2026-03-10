import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from './store/useCartStore';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './lib/supabase';
import WhatsAppButton from './components/WhatsAppButton';

function MobileCartButton() {
  const location = useLocation();
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());
  
  if (location.pathname === '/cart' || location.pathname === '/checkout' || totalItems === 0) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[var(--color-card)] border-t border-[var(--color-border)] p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-xs text-[var(--color-text)] opacity-70">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</span>
        <span className="font-bold text-lg text-[var(--color-navy)] dark:text-[var(--color-gold)]">₹{totalPrice.toLocaleString('en-IN')}</span>
      </div>
      <Link 
        to="/cart" 
        className="bg-[var(--color-gold)] text-[var(--color-navy)] px-6 py-3 rounded-full font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center gap-2 shadow-md uppercase tracking-wider text-sm"
      >
        <ShoppingCart size={18} />
        View Cart
      </Link>
    </div>
  );
}

export default function App() {
  const theme = useThemeStore((state) => state.theme);
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({data}) => {
          if (data) {
             setUser({ id: data.id, email: data.email, full_name: data.full_name, is_admin: data.is_admin });
          } else {
             setUser({ id: session.user.id, email: session.user.email, is_admin: false });
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileCartButton />
      </div>
    </Router>
  );
}
