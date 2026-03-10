import Header from "@/components/Header";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

import necklaceImg from "@assets/stock_images/elegant_traditional__f8f6bf4e.jpg";
import banglesImg from "@assets/stock_images/elegant_gold_bangles_98295b56.jpg";
import earringsImg from "@assets/stock_images/traditional_indian_e_2d815851.jpg";

export default function Cart() {
  const cartItems = [
    {
      id: "1",
      name: "Traditional Gold Necklace Set",
      category: "Necklaces",
      price: 2499,
      image: necklaceImg,
      quantity: 2,
    },
    {
      id: "2",
      name: "Classic Gold Bangles",
      category: "Bangles",
      price: 1599,
      image: banglesImg,
      quantity: 1,
    },
    {
      id: "3",
      name: "Traditional Earrings",
      category: "Earrings",
      price: 899,
      image: earringsImg,
      quantity: 1,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-end px-4 py-2 border-b">
        <ThemeToggle />
      </div>
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8" data-testid="text-cart-title">
            Shopping Cart
          </h1>

          <div className="flex gap-8 flex-col lg:flex-row">
            <div className="flex-1">
              {cartItems.length > 0 ? (
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      onUpdateQuantity={(id, qty) => console.log(`Update ${id} to ${qty}`)}
                      onRemove={(id) => console.log(`Remove ${id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">Your cart is empty</p>
                </div>
              )}
            </div>

            <div className="lg:w-96">
              <CartSummary
                subtotal={subtotal}
                shipping={subtotal >= 500 ? 0 : 50}
                onCheckout={() => console.log('Proceed to checkout')}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
