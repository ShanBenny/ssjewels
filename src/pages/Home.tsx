import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, Shield, Truck, Clock, RefreshCw, Mail } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import GlobalLoader from '../components/GlobalLoader';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 4);
  const bestSellers = [...products].sort((a, b) => (a.stock || Infinity) - (b.stock || Infinity)).slice(0, 4);

  return (
    <div className="min-h-screen">
      <GlobalLoader isOpen={isLoading} />
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
          <HeroBanner />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-start">
          <div className="max-w-2xl text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-tight"
            >
              Elegant Jewellery for Every Occasion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-200 mb-10 font-light mr-auto"
            >
              Discover premium imitation jewellery, designer sarees, and elegant home decor crafted to enhance your style.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-start"
            >
              <Link
                to="/products?category=Imitation%20Jewellery"
                className="bg-[var(--color-gold)] text-[var(--color-navy)] px-8 py-4 rounded-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                Shop Jewellery <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?category=Ladies%20Sarees"
                className="bg-transparent border border-white text-white px-8 py-4 rounded-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                Explore Sarees <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Below Hero */}
      <section className="py-8 bg-[var(--color-navy)] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <Shield className="text-[var(--color-gold)]" size={24} />
              <span className="text-xs uppercase tracking-widest font-medium">Quality Guaranteed</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Truck className="text-[var(--color-gold)]" size={24} />
              <span className="text-xs uppercase tracking-widest font-medium">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <RefreshCw className="text-[var(--color-gold)]" size={24} />
              <span className="text-xs uppercase tracking-widest font-medium">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Clock className="text-[var(--color-gold)]" size={24} />
              <span className="text-xs uppercase tracking-widest font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">Shop by Category</h2>
            <div className="w-24 h-1 bg-[var(--color-gold)] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Jewellery', path: 'Imitation Jewellery', image: 'https://images.unsplash.com/photo-1599643478514-4a820c56a8e9?auto=format&fit=crop&q=80&w=800' },
              { name: 'Sarees', path: 'Ladies Sarees', image: 'https://images.unsplash.com/photo-1610189014029-79a022b4eb14?auto=format&fit=crop&q=80&w=800' },
              { name: 'Home Decor', path: 'Small Home Items', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.path}`}
                className="group relative h-[450px] overflow-hidden shadow-md"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                  <div className="w-full text-center">
                    <h3 className="text-2xl font-serif font-bold text-white mb-3">{category.name}</h3>
                    <span className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[var(--color-gold)] font-medium border-b border-[var(--color-gold)] pb-1 group-hover:gap-4 transition-all">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">Best Sellers</h2>
              <div className="w-24 h-1 bg-[var(--color-gold)]"></div>
            </div>
            <Link to="/products?sort=popular" className="text-[var(--color-navy)] dark:text-gray-300 font-medium hover:text-[var(--color-gold)] transition-colors hidden sm:flex items-center gap-2 uppercase tracking-wider text-sm">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products?sort=popular" className="inline-flex items-center gap-2 text-[var(--color-navy)] dark:text-[var(--color-gold)] font-medium uppercase tracking-wider text-sm border-b border-current pb-1">
              View All Best Sellers <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">New Arrivals</h2>
              <div className="w-24 h-1 bg-[var(--color-gold)]"></div>
            </div>
            <Link to="/products?sort=newest" className="text-[var(--color-navy)] dark:text-gray-300 font-medium hover:text-[var(--color-gold)] transition-colors hidden sm:flex items-center gap-2 uppercase tracking-wider text-sm">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[var(--color-navy)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">The SS Imitation Promise</h2>
              <div className="w-24 h-1 bg-[var(--color-gold)] mb-8"></div>
              <p className="text-gray-300 mb-8 leading-relaxed">
                We believe that luxury should be accessible. Our master craftsmen create stunning pieces that capture the brilliance of fine jewellery without the premium price tag. Every piece is meticulously designed and quality-checked to ensure it meets our exacting standards.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center shrink-0">
                    <Shield className="text-[var(--color-gold)]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl mb-2">Uncompromising Quality</h4>
                    <p className="text-gray-400 text-sm">Premium materials that resist tarnishing and maintain their brilliance for years.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center shrink-0">
                    <Star className="text-[var(--color-gold)]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl mb-2">Exquisite Craftsmanship</h4>
                    <p className="text-gray-400 text-sm">Intricate detailing inspired by traditional and contemporary fine jewellery designs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover rounded-t-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-2 border-[var(--color-gold)] rounded-t-full transform translate-x-4 translate-y-4 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">Customer Reviews</h2>
            <div className="w-24 h-1 bg-[var(--color-gold)] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', text: 'The quality of the jewellery is exceptional. It looks exactly like real gold and the finish is perfect. I received so many compliments at the wedding!' },
              { name: 'Anjali Desai', text: 'I ordered a designer saree and a matching necklace set. The delivery was incredibly fast, and the packaging felt so premium. Will definitely shop again.' },
              { name: 'Meera Reddy', text: 'Their customer service is outstanding. I had a question about a bangle size, and they helped me find the perfect fit. The pieces are stunning in person.' }
            ].map((review, i) => (
              <div key={i} className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border-color)] relative">
                <div className="absolute -top-4 left-8 text-4xl text-[var(--color-gold)] font-serif">"</div>
                <div className="flex text-[var(--color-gold)] mb-6 mt-2">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-[var(--color-text)] opacity-80 mb-8 italic text-sm leading-relaxed">
                  {review.text}
                </p>
                <div className="flex items-center gap-4 border-t border-[var(--border-color)] pt-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="User" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-navy)] dark:text-gray-200">{review.name}</h4>
                    <span className="text-xs text-[var(--color-text)] opacity-50 uppercase tracking-wider">Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[var(--card-bg)] border-t border-[var(--border-color)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="mx-auto text-[var(--color-gold)] mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">Join Our Exclusive Club</h2>
          <p className="text-[var(--color-text)] opacity-70 mb-8">
            Subscribe to receive updates on new arrivals, special offers, and styling tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow px-6 py-4 bg-[var(--color-bg)] border border-[var(--border-color)] rounded-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-text)]"
              required
            />
            <button 
              type="submit" 
              className="bg-[var(--color-gold)] text-[var(--color-navy)] px-8 py-4 rounded-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-300 uppercase tracking-wider text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
