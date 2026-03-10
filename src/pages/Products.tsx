import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest' | 'popular'>(
    (sortParam as any) || 'newest'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      const { data, error: sbError } = await supabase
        .from('products')
        .select('*');
      
      if (sbError) {
        console.error("Supabase API fail: ", sbError);
        setError("Something went wrong. Please try again.");
      } else {
        setProducts(data || []);
      }
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  const categories = ['All', 'Imitation Jewellery', 'Ladies Sarees', 'Small Home Items'];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category_id === selectedCategory || p.category === selectedCategory);
    }
    
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming newest is by ID or created_at
        result.sort((a, b) => {
          if (a.created_at && b.created_at) {
             return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return 0;
        });
        break;
      case 'popular':
        result.sort((a, b) => a.stock - b.stock);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    return result;
  }, [selectedCategory, sortBy, products]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort as any);
    if (sort === 'featured') {
      searchParams.delete('sort');
    } else {
      searchParams.set('sort', sort);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">
            {selectedCategory === 'All' ? 'Our Collection' : selectedCategory}
          </h1>
          <div className="w-16 h-1 bg-[var(--color-gold)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text)] opacity-70 font-light max-w-2xl mx-auto">
            Explore our carefully curated selection of premium pieces, designed to elevate your everyday style and special occasions.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[var(--color-navy)] dark:bg-[var(--color-gold)] text-white dark:text-[var(--color-navy)]'
                    : 'bg-transparent text-[var(--color-text)] opacity-70 hover:opacity-100 border border-[var(--color-border)] hover:border-[var(--color-gold)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between w-full md:w-auto gap-6">
            <span className="text-xs text-[var(--color-text)] opacity-60 uppercase tracking-widest hidden md:block">
              {filteredProducts.length} Results
            </span>
            
            <div className="flex items-center gap-2 relative group">
              <span className="text-xs text-[var(--color-text)] opacity-60 uppercase tracking-widest">Sort by:</span>
              <div className="relative flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-transparent text-sm font-medium text-[var(--color-navy)] dark:text-[var(--color-gold)] focus:outline-none cursor-pointer pr-6 pl-2 py-1"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">New Arrivals</option>
                  <option value="popular">Best Sellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 text-[var(--color-navy)] dark:text-[var(--color-gold)] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid / Error State */}
        {error ? (
          <div className="text-center py-32 bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-xl border border-red-200 dark:border-red-900">
            <h3 className="text-2xl font-serif font-bold text-red-600 mb-4">{error}</h3>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-[var(--color-gold)] text-[var(--color-navy)] px-8 py-4 rounded-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center uppercase tracking-wider text-sm"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-xl border border-[var(--color-border)]">
            <h3 className="text-2xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4">No products found</h3>
            <p className="text-[var(--color-text)] opacity-70 font-light mb-8 max-w-md mx-auto">
              We couldn't find any products matching your current selection. Try adjusting your filters or exploring another category.
            </p>
            <button 
              onClick={() => handleCategoryChange('All')}
              className="bg-[var(--color-gold)] text-[var(--color-navy)] px-8 py-4 rounded-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center uppercase tracking-wider text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
