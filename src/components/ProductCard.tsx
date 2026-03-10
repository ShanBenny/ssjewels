import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { getSupabaseImageUrl } from '../lib/utils';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isAdding, setIsAdding] = useState(false);

  React.useEffect(() => {
    if (user) {
      supabase.from('wishlist').select('id').eq('user_id', user.id).eq('product_id', product.id).single()
        .then(({data}) => {
          if (data) setIsWishlisted(true);
        });
    } else {
      setIsWishlisted(false);
    }
  }, [user, product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setTimeout(() => {
      // Ensure image_url is mapped over to images array when adding to cart
      const cartProduct: Product = {
        ...product,
        images: product.images || [product.image_url]
      };
      addItem(cartProduct);
      setIsAdding(false);
    }, 1000);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to add to wishlist");
      return;
    }
    if (isWishlisted) {
      setIsWishlisted(false);
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id);
    } else {
      setIsWishlisted(true);
      await supabase.from('wishlist').insert([{ user_id: user.id, product_id: product.id }]);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    // Quick view logic would go here
  };

  const rawImageUrl = product.image_url || (product.images && product.images.length > 0 ? product.images[0] : '');
  const imageUrl = getSupabaseImageUrl(rawImageUrl);

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-500 border border-[var(--border-color)] flex flex-col h-full relative">
        <div className="relative aspect-square overflow-hidden bg-[var(--color-bg)] border-b border-[var(--border-color)]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1599643478514-4a820c56a8e9?q=80&w=800&auto=format&fit=crop';
            }}
          />
        ) : (
          <img 
            src={'https://images.unsplash.com/photo-1599643478514-4a820c56a8e9?q=80&w=800&auto=format&fit=crop'} 
            alt={product.name} 
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
            referrerPolicy="no-referrer"
          />
        )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.stock < 5 && product.stock > 0 && (
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-red-100">
                Few Left
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-gray-200">
                Sold Out
              </span>
            )}
            {product.featured && (
              <span className="bg-[var(--color-gold)]/10 text-[var(--color-gold-dark)] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-[var(--color-gold)]/20">
                Bestseller
              </span>
            )}
          </div>

          {/* Action Buttons (Right side) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
            <button
              onClick={toggleWishlist}
              className="w-8 h-8 bg-[var(--card-bg)] rounded-full flex items-center justify-center shadow-md hover:bg-[var(--border-color)] transition-colors text-[var(--text-secondary)] hover:text-red-500"
              aria-label="Add to wishlist"
            >
              <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
            </button>
            <button
              onClick={handleQuickView}
              className="w-8 h-8 bg-[var(--card-bg)] rounded-full flex items-center justify-center shadow-md hover:bg-[var(--border-color)] transition-colors text-[var(--text-secondary)] hover:text-[var(--color-gold)]"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </button>
          </div>
          
          {/* Add to Cart & Buy Now Buttons (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className="w-full border border-[var(--color-gold)] text-[var(--color-gold)] py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-2 hover:bg-[var(--color-gold)] hover:text-[#000000] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md uppercase tracking-wider bg-[var(--card-bg)]"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShoppingBag size={14} />
              )}
              {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                const cartProduct: Product = {
                  ...product,
                  images: product.images || [product.image_url]
                };
                addItem(cartProduct);
                window.location.href = '/checkout';
              }}
              disabled={product.stock === 0}
              className="w-full bg-[var(--color-gold)] text-[#000000] py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-2 hover:bg-[#c9a52e] hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              Buy Now
            </button>
          </div>
          
          {/* Gradient overlay for text readability when button slides up */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow text-center bg-[var(--card-bg)] relative z-20">
          <h3 className="font-serif text-[var(--text-primary)] text-lg leading-snug mb-2 line-clamp-2 hover:text-[var(--color-gold)] transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto flex flex-col items-center gap-1">
            <span className="font-medium text-lg text-[var(--color-gold)]">
              ₹{(product.price || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
              {product.category_id || product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
