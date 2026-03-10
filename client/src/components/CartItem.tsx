import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CartItemProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

export default function CartItem({ 
  id, 
  name, 
  category, 
  price, 
  image, 
  quantity: initialQuantity,
  onUpdateQuantity,
  onRemove
}: CartItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdateQuantity?.(id, newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity?.(id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4" data-testid={`cart-item-${id}`}>
      <div className="w-24 h-24 rounded-md overflow-hidden bg-card flex-shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm mb-1" data-testid={`text-item-name-${id}`}>{name}</h3>
        <p className="text-xs text-muted-foreground mb-2" data-testid={`text-item-category-${id}`}>{category}</p>
        <p className="font-accent font-semibold" data-testid={`text-item-price-${id}`}>₹{price}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => onRemove?.(id)}
          data-testid={`button-remove-${id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            data-testid={`button-decrease-${id}`}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-medium" data-testid={`text-quantity-${id}`}>{quantity}</span>
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrease}
            data-testid={`button-increase-${id}`}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
