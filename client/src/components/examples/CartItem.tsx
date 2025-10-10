import CartItem from '../CartItem';
import necklaceImg from "@assets/stock_images/elegant_traditional__f8f6bf4e.jpg";

export default function CartItemExample() {
  return (
    <div className="p-8 max-w-2xl">
      <CartItem
        id="1"
        name="Traditional Gold Necklace Set"
        category="Necklaces"
        price={2499}
        image={necklaceImg}
        quantity={2}
        onUpdateQuantity={(id, qty) => console.log(`Update ${id} to ${qty}`)}
        onRemove={(id) => console.log(`Remove ${id}`)}
      />
    </div>
  );
}
