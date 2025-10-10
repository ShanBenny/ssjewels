import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  onCheckout?: () => void;
}

export default function CartSummary({ subtotal, shipping = 0, onCheckout }: CartSummaryProps) {
  const total = subtotal + shipping;
  const freeShippingThreshold = 500;
  const needsForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="border rounded-md p-6 sticky top-24">
      <h3 className="font-semibold text-lg mb-4" data-testid="text-order-summary">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span data-testid="text-subtotal">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span data-testid="text-shipping">
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-semibold text-lg mb-4">
        <span>Total</span>
        <span data-testid="text-total">₹{total}</span>
      </div>

      {needsForFreeShipping > 0 && (
        <p className="text-xs text-muted-foreground mb-4" data-testid="text-free-shipping-notice">
          Add ₹{needsForFreeShipping} more for FREE shipping!
        </p>
      )}

      <Button className="w-full" onClick={onCheckout} data-testid="button-checkout">
        Proceed to Checkout
      </Button>
    </div>
  );
}
