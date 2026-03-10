import OrderCard from '../OrderCard';
import necklaceImg from "@assets/stock_images/elegant_traditional__f8f6bf4e.jpg";

export default function OrderCardExample() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="space-y-4">
        <OrderCard
          id="1"
          orderNumber="12345"
          date="Dec 15, 2024"
          status="delivered"
          total={4998}
          items={[
            { name: "Necklace", quantity: 2, image: necklaceImg },
            { name: "Earrings", quantity: 1, image: necklaceImg },
          ]}
        />
        <OrderCard
          id="2"
          orderNumber="12346"
          date="Dec 18, 2024"
          status="shipped"
          total={1899}
          items={[
            { name: "Choker", quantity: 1, image: necklaceImg },
          ]}
        />
      </div>
    </div>
  );
}
