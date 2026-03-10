import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Heart, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import GlobalLoader from '../components/GlobalLoader';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [isPreparing, setIsPreparing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPreparing(true);
    setTimeout(() => {
      setIsPreparing(false);
      navigate('/checkout');
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-bg)] px-4 transition-colors duration-300">
        <div className="w-24 h-24 bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6 text-[var(--color-gold)]">
          <ShoppingBag size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">Your cart is empty</h2>
        <p className="text-[var(--color-text)] opacity-70 mb-8 text-center max-w-md font-light">
          Looks like you haven't added anything to your cart yet. Explore our collection and find something you love.
        </p>
        <Link
          to="/products"
          className="bg-[var(--color-gold)] text-[var(--color-navy)] px-8 py-4 rounded-sm font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 uppercase tracking-wider text-sm"
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 transition-colors duration-300">
      <GlobalLoader isOpen={isPreparing} message="Preparing Checkout..." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">Shopping Cart</h1>
          <Link to="/products" className="text-[var(--color-text)] opacity-70 hover:text-[var(--color-gold)] transition-colors flex items-center gap-2 text-sm uppercase tracking-wider">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-xl p-6 sm:p-8 shadow-sm border border-[var(--color-border)]">
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] opacity-60 uppercase tracking-widest">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-[var(--color-border)]">
                {items.map((item) => (
                  <div key={item.id} className="py-6 sm:py-8 flex flex-col sm:grid sm:grid-cols-12 gap-6 sm:items-center group">
                    {/* Product Info */}
                    <div className="col-span-6 flex gap-6">
                      <Link to={`/product/${item.id}`} className="w-24 h-32 sm:w-28 sm:h-36 rounded-sm overflow-hidden shrink-0 bg-white dark:bg-black border border-[var(--color-border)] relative">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                      <div className="flex flex-col justify-center py-1">
                        <div className="text-[10px] text-[var(--color-gold)] font-medium uppercase tracking-widest mb-1">
                          {item.category}
                        </div>
                        <Link to={`/product/${item.id}`} className="font-serif font-bold text-lg text-[var(--color-navy)] dark:text-gray-200 hover:text-[var(--color-gold)] transition-colors line-clamp-2 mb-2">
                          {item.name}
                        </Link>
                        <div className="text-[var(--color-text)] opacity-70 font-medium mb-4">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center gap-4 mt-auto">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[var(--color-text)] opacity-50 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 hover:text-red-500 hover:opacity-100 transition-colors"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-3 flex sm:justify-center items-center mt-4 sm:mt-0">
                      <div className="flex items-center border border-[var(--color-border)] rounded-sm bg-transparent h-10">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-full flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-medium text-[var(--color-text)] text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-full flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="col-span-3 flex justify-between sm:justify-end items-center sm:block text-right mt-4 sm:mt-0">
                      <span className="sm:hidden text-[var(--color-text)] opacity-70 font-medium text-sm">Total:</span>
                      <div className="font-medium text-lg text-[var(--color-navy)] dark:text-[var(--color-gold)]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-xl p-6 sm:p-8 shadow-sm border border-[var(--color-border)] sticky top-24">
              <h2 className="text-xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-6 pb-4 border-b border-[var(--color-border)]">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-[var(--color-text)] opacity-80 mb-6 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[var(--color-text)] opacity-100">₹{totalPrice().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[var(--color-gold)]">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium text-[var(--color-text)] opacity-100">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-[var(--color-border)] pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-[var(--color-text)] uppercase tracking-wider text-sm">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">
                      ₹{totalPrice().toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-[var(--color-text)] opacity-50 mt-1 uppercase tracking-widest">Including GST</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-[var(--color-gold)] text-[var(--color-navy)] px-6 py-4 rounded-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--color-text)] opacity-60 uppercase tracking-widest">
                <ShieldCheck size={16} className="text-[var(--color-gold)]" />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
