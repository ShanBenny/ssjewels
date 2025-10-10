import CartSummary from '../CartSummary';

export default function CartSummaryExample() {
  return (
    <div className="p-8 max-w-sm">
      <CartSummary 
        subtotal={4998} 
        shipping={0}
        onCheckout={() => console.log('Checkout clicked')}
      />
    </div>
  );
}
