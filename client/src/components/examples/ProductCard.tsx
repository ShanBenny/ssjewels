import ProductCard from '../ProductCard';
import necklaceImg from "@assets/stock_images/elegant_traditional__f8f6bf4e.jpg";

export default function ProductCardExample() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl">
        <ProductCard
          id="1"
          name="Traditional Gold Necklace Set"
          category="Necklaces"
          price={2499}
          originalPrice={3499}
          image={necklaceImg}
          inStock={true}
          isNew={true}
        />
        <ProductCard
          id="2"
          name="Elegant Choker Design"
          category="Chokers"
          price={1899}
          image={necklaceImg}
          inStock={true}
        />
      </div>
    </div>
  );
}
