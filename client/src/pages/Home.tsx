import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryTile from "@/components/CategoryTile";
import ProductCard from "@/components/ProductCard";
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

export default function Home() {
  const categories = [
    { name: "Necklaces", image: necklaceImg1, count: 45 },
    { name: "Bangles", image: banglesImg1, count: 32 },
    { name: "Earrings", image: earringsImg1, count: 28 },
    { name: "Rings", image: ringsImg1, count: 24 },
    { name: "Chokers", image: chokerImg1, count: 18 },
    { name: "New Arrivals", image: necklaceImg2, count: 15 },
  ];

  const featuredProducts = [
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
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-end px-4 py-2 border-b">
        <ThemeToggle />
      </div>
      <Header />
      <HeroSection />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-categories-title">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryTile
                key={category.name}
                name={category.name}
                image={category.image}
                count={category.count}
              />
            ))}
          </div>
        </section>

        <section className="bg-card py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" data-testid="text-featured-title">
                Featured Collection
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Free Shipping on Orders Over ₹500
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Quality jewelry delivered to your doorstep with care
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
