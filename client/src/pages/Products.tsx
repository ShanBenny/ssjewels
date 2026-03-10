import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

import necklaceImg1 from "@assets/stock_images/elegant_traditional__f8f6bf4e.jpg";
import necklaceImg2 from "@assets/stock_images/elegant_traditional__1daa409a.jpg";
import necklaceImg3 from "@assets/stock_images/elegant_traditional__68d262bc.jpg";
import banglesImg1 from "@assets/stock_images/elegant_gold_bangles_98295b56.jpg";
import banglesImg2 from "@assets/stock_images/elegant_gold_bangles_099f783e.jpg";
import earringsImg1 from "@assets/stock_images/traditional_indian_e_2d815851.jpg";
import earringsImg2 from "@assets/stock_images/traditional_indian_e_406512b0.jpg";
import ringsImg1 from "@assets/stock_images/gold_rings_jewelry_e_b1992bc6.jpg";
import ringsImg2 from "@assets/stock_images/gold_rings_jewelry_e_5c5155ce.jpg";
import chokerImg1 from "@assets/stock_images/traditional_choker_n_a2a8c5f3.jpg";
import chokerImg2 from "@assets/stock_images/traditional_choker_n_3a4cd969.jpg";

export default function Products() {
  const products = [
    {
      id: "1",
      name: "Traditional Gold Necklace Set",
      category: "Necklaces",
      price: 2499,
      originalPrice: 3499,
      image: necklaceImg1,
      inStock: true,
      isNew: true,
    },
    {
      id: "2",
      name: "Elegant Choker Design",
      category: "Chokers",
      price: 1899,
      image: chokerImg1,
      inStock: true,
    },
    {
      id: "3",
      name: "Classic Gold Bangles",
      category: "Bangles",
      price: 1599,
      originalPrice: 2299,
      image: banglesImg1,
      inStock: true,
      isNew: true,
    },
    {
      id: "4",
      name: "Traditional Earrings",
      category: "Earrings",
      price: 899,
      image: earringsImg1,
      inStock: true,
    },
    {
      id: "5",
      name: "Designer Ring Collection",
      category: "Rings",
      price: 699,
      image: ringsImg1,
      inStock: false,
    },
    {
      id: "6",
      name: "Antique Necklace Set",
      category: "Necklaces",
      price: 3299,
      image: necklaceImg2,
      inStock: true,
    },
    {
      id: "7",
      name: "Royal Choker Set",
      category: "Chokers",
      price: 2199,
      image: chokerImg2,
      inStock: true,
      isNew: true,
    },
    {
      id: "8",
      name: "Pearl Drop Earrings",
      category: "Earrings",
      price: 1299,
      image: earringsImg2,
      inStock: true,
    },
    {
      id: "9",
      name: "Vintage Necklace",
      category: "Necklaces",
      price: 2799,
      image: necklaceImg3,
      inStock: true,
    },
    {
      id: "10",
      name: "Gold Plated Bangles",
      category: "Bangles",
      price: 1799,
      image: banglesImg2,
      inStock: true,
    },
    {
      id: "11",
      name: "Diamond Ring Set",
      category: "Rings",
      price: 999,
      image: ringsImg2,
      inStock: true,
      isNew: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-end px-4 py-2 border-b">
        <ThemeToggle />
      </div>
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8" data-testid="text-products-title">
            All Jewelry
          </h1>

          <div className="flex gap-8 flex-col lg:flex-row">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters />
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6">
                <p className="text-muted-foreground" data-testid="text-product-count">
                  Showing {products.length} products
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
