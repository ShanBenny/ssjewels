import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import GlobalLoader from './GlobalLoader';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isPreparing, setIsPreparing] = useState(false);
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPreparing(true);
    setTimeout(() => {
      setIsPreparing(false);
      onClose();
      navigate('/checkout');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      <GlobalLoader isOpen={isPreparing} message="Preparing Checkout..." />
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[var(--color-bg)] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart ({items.length})
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:bg-[var(--border-color)] rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6 hide-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
              <ShoppingBag size={48} className="mb-4 text-[var(--color-gold)]" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm mb-6">Looks like you haven't added anything yet.</p>
              <button 
                onClick={onClose}
                className="text-[var(--color-navy)] dark:text-[var(--color-gold)] font-medium uppercase tracking-wider text-sm border-b border-current pb-1"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 rounded-sm overflow-hidden shrink-0 bg-[var(--card-bg)]">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-sm text-[var(--color-navy)] dark:text-gray-200 line-clamp-2 pr-4">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-[var(--text-primary)] opacity-50 hover:opacity-100 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-[var(--color-gold)] uppercase tracking-widest">{item.category}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[var(--border-color)] rounded-sm h-8">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-full flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--color-gold)] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                          className="w-8 h-full flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--color-gold)] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[var(--border-color)] bg-[var(--card-bg)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[var(--text-primary)] opacity-80">Subtotal</span>
              <span className="text-xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-[var(--text-primary)] opacity-60 mb-6 text-center">
              Shipping and taxes calculated at checkout.
            </p>
            <button 
              onClick={handleCheckout}
              className="w-full bg-[var(--color-gold)] text-[var(--color-navy)] py-4 rounded-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
