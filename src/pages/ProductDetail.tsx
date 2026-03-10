import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ChevronRight, Star, Truck, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import GlobalLoader from '../components/GlobalLoader';
import { getSupabaseImageUrl } from '../lib/utils';
import { Helmet } from 'react-helmet-async';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchProductData() {
      setIsLoading(true);
      if (id) {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (data && !error) {
          setProduct(data);
          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', data.category_id || data.category)
            .neq('id', data.id)
            .limit(4);
          if (related) setRelatedProducts(related);

          const { data: reviewsData } = await supabase
            .from('reviews')
            .select(`*, profiles(full_name)`)
            .eq('product_id', data.id)
            .order('created_at', { ascending: false });
          if (reviewsData) setReviews(reviewsData);

          if (user) {
            const { data: wlData } = await supabase.from('wishlist').select('id').eq('user_id', user.id).eq('product_id', data.id).maybeSingle();
            if (wlData) setIsWishlisted(true);
          }
        }
      }
      setIsLoading(false);
    }
    fetchProductData();
  }, [id]);

  if (isLoading) {
     return <GlobalLoader isOpen={true} message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] transition-colors duration-300">
        <h2 className="text-2xl font-serif font-bold text-[var(--color-text)] mb-4">Product not found</h2>
        <Link to="/products" className="text-[var(--color-navy)] dark:text-[var(--color-gold)] hover:underline flex items-center gap-2 uppercase tracking-wider text-sm">
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      const cartProduct: Product = {
        ...product,
        images: product.images || [product.image_url]
      };
      addItem(cartProduct, quantity);
      setIsAdding(false);
    }, 1000);
  };

  const toggleWishlist = async () => {
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

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit a review");
      return;
    }
    setIsSubmittingReview(true);
    const { data: newReview, error } = await supabase.from('reviews').insert([{
      user_id: user.id,
      product_id: product.id,
      rating,
      comment: reviewText
    }]).select('*, profiles(full_name)').single();
    
    if (newReview && !error) {
      setReviews([newReview, ...reviews]);
      setReviewText('');
      setRating(5);
    }
    setIsSubmittingReview(false);
  };

  const rawImagesList = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const imagesList = rawImagesList.map(img => getSupabaseImageUrl(img));
  const displayCategory = product.category_id || product.category;
  
  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;


  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 transition-colors duration-300">
      {product && (
        <Helmet>
          <title>{product.name} | SS Imitation Jewels</title>
          <meta name="description" content={product.description?.substring(0, 160) || 'Buy high quality imitation jewelry'} />
        </Helmet>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text)] opacity-70 mb-8 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
          <Link to="/" className="hover:text-[var(--color-gold)] transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${displayCategory}`} className="hover:text-[var(--color-gold)] transition-colors">{displayCategory}</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--color-text)] opacity-100 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 lg:gap-6">
            <div className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0 hide-scrollbar">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-24 sm:w-full sm:h-32 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-[#F9F9F9] dark:bg-[#1A1A1A] ${
                    activeImage === idx ? 'border-[var(--color-gold)]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </button>
              ))}
            </div>
            <div className="relative flex-grow bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-xl overflow-hidden aspect-[4/5] sm:aspect-auto sm:h-[600px] group cursor-zoom-in">
              <img
                src={imagesList[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              {product.stock < 5 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider border border-red-100 shadow-sm">
                  Only {product.stock} left
                </div>
              )}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors shadow-sm">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col py-4">
            <div className="mb-8 border-b border-[var(--color-border)] pb-8">
              <div className="text-xs text-[var(--color-gold)] font-medium uppercase tracking-widest mb-3">
                {displayCategory}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-[var(--color-gold)]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} stroke="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-[var(--color-text)] opacity-70">
                  {reviews.length > 0 ? `${averageRating} (${reviews.length} Reviews)` : 'No Reviews Yet'}
                </span>
              </div>
              <div className="text-3xl font-medium text-[var(--color-text)]">
                ₹{(product.price || 0).toLocaleString('en-IN')}
                <span className="text-xs font-normal text-[var(--color-text)] opacity-50 ml-3 uppercase tracking-wider">Inclusive of all taxes</span>
              </div>
            </div>

            <div className="prose prose-sm text-[var(--color-text)] opacity-80 mb-10 leading-relaxed font-light">
              <p>{product.description}</p>
              <ul className="mt-4 space-y-2">
                <li>• Premium quality materials</li>
                <li>• Hypoallergenic and skin-friendly</li>
                <li>• Comes in a luxury velvet box</li>
                <li>• 1-year warranty on plating</li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center border border-[var(--color-border)] rounded-sm bg-transparent h-14">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium text-[var(--color-text)]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-full flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdding}
                  className="flex-grow w-full sm:w-auto h-14 bg-[var(--color-gold)] text-[var(--color-navy)] px-8 rounded-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                >
                  {isAdding ? (
                    <div className="w-5 h-5 border-2 border-[var(--color-navy)] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCart size={18} />
                  )}
                  {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button 
                  onClick={toggleWishlist}
                  className={`w-14 h-14 shrink-0 border border-[var(--color-border)] rounded-sm flex items-center justify-center transition-all ${isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'text-[var(--color-text)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]'}`}
                >
                  <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs uppercase tracking-wider text-[var(--color-text)] opacity-80 border-t border-[var(--color-border)] pt-8">
              <div className="flex flex-col items-center text-center gap-3 p-4 bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-sm">
                <ShieldCheck className="text-[var(--color-gold)]" size={24} />
                <span className="font-medium">Quality Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-4 bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-sm">
                <Truck className="text-[var(--color-gold)]" size={24} />
                <span className="font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-4 bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-sm">
                <RefreshCw className="text-[var(--color-gold)]" size={24} />
                <span className="font-medium">Easy Returns</span>
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
              <h3 className="text-2xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-6">Customer Reviews</h3>
              
              {user ? (
                <form onSubmit={submitReview} className="mb-10 bg-[#F9F9F9] dark:bg-[#1A1A1A] p-6 rounded-xl border border-[var(--color-border)]">
                  <h4 className="font-medium text-[var(--color-navy)] dark:text-gray-200 mb-4">Write a Review</h4>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text)] opacity-70 uppercase tracking-wider mb-2">Rating</label>
                    <div className="flex items-center gap-2">
                       {[1, 2, 3, 4, 5].map(star => (
                         <button type="button" key={star} onClick={() => setRating(star)} className="text-[var(--color-gold)]">
                           <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text)] opacity-70 uppercase tracking-wider mb-2">Comment</label>
                    <textarea 
                      required 
                      rows={3} 
                      value={reviewText} 
                      onChange={e => setReviewText(e.target.value)}
                      className="w-full px-4 py-3 rounded-sm border bg-white dark:bg-black text-[var(--color-text)] border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" 
                      placeholder="Share your thoughts..."
                    />
                  </div>
                  <button type="submit" disabled={isSubmittingReview} className="m-0 bg-[var(--color-gold)] text-[var(--color-navy)] px-6 py-3 rounded-sm font-medium hover:scale-[1.02] transition-all disabled:opacity-50 text-sm uppercase">
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="mb-10 p-4 bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text)] opacity-80">
                  <Link to="/auth" className="text-[var(--color-navy)] dark:text-[var(--color-gold)] underline font-medium">Log in</Link> to write a review.
                </div>
              )}

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-[var(--color-text)] opacity-70 text-sm">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-[var(--color-border)] last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[var(--color-navy)] dark:text-gray-200">
                           {review.profiles?.full_name || 'Anonymous User'}
                        </span>
                        <span className="text-xs text-[var(--color-text)] opacity-50">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-[var(--color-gold)] mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-sm text-[var(--color-text)] opacity-80 leading-relaxed font-light">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-20 border-t border-[var(--color-border)]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">You May Also Like</h2>
              <div className="w-16 h-1 bg-[var(--color-gold)] mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
