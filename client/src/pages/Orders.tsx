import Header from "@/components/Header";
import OrderCard from "@/components/OrderCard";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

import necklaceImg from "@assets/stock_images/elegant_traditional__f8f6bf4e.jpg";
import banglesImg from "@assets/stock_images/elegant_gold_bangles_98295b56.jpg";
import earringsImg from "@assets/stock_images/traditional_indian_e_2d815851.jpg";
import chokerImg from "@assets/stock_images/traditional_choker_n_a2a8c5f3.jpg";

export default function Orders() {
  const orders = [
    {
      id: "1",
      orderNumber: "12345",
      date: "Dec 15, 2024",
      status: "delivered" as const,
      total: 4998,
      items: [
        { name: "Necklace", quantity: 2, image: necklaceImg },
        { name: "Earrings", quantity: 1, image: earringsImg },
      ],
    },
    {
      id: "2",
      orderNumber: "12346",
      date: "Dec 18, 2024",
      status: "shipped" as const,
      total: 1899,
      items: [{ name: "Choker", quantity: 1, image: chokerImg }],
    },
    {
      id: "3",
      orderNumber: "12347",
      date: "Dec 20, 2024",
      status: "processing" as const,
      total: 1599,
      items: [{ name: "Bangles", quantity: 1, image: banglesImg }],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-end px-4 py-2 border-b">
        <ThemeToggle />
      </div>
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8" data-testid="text-orders-title">
            My Orders
          </h1>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} {...order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No orders yet</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
