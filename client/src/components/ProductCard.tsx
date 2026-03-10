import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  isNew?: boolean;
}

export default function ProductCard({ 
  id, 
  name, 
  category, 
  price, 
  originalPrice, 
  image, 
  inStock,
  isNew 
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group relative" data-testid={`product-card-${id}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-card mb-3">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm ${isWishlisted ? 'text-destructive' : ''}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
          data-testid={`button-wishlist-${id}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>

        {isNew && (
          <Badge className="absolute top-2 left-2 bg-ring text-foreground" data-testid={`badge-new-${id}`}>
            New
          </Badge>
        )}

        {!inStock && (
          <Badge variant="destructive" className="absolute top-2 left-2" data-testid={`badge-out-of-stock-${id}`}>
            Out of Stock
          </Badge>
        )}

        <Button
          size="sm"
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={!inStock}
          data-testid={`button-add-cart-${id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-1" data-testid={`text-category-${id}`}>{category}</p>
        <h3 className="font-medium text-sm mb-2 line-clamp-2" data-testid={`text-name-${id}`}>{name}</h3>
        <div className="flex items-center gap-2">
          <p className="font-accent font-semibold text-lg" data-testid={`text-price-${id}`}>₹{price}</p>
          {originalPrice && (
            <p className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${id}`}>
              ₹{originalPrice}
            </p>
          )}
        </div>
        {inStock ? (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-chart-3" />
            <p className="text-xs text-muted-foreground" data-testid={`text-stock-${id}`}>In Stock</p>
          </div>
        ) : (
          <p className="text-xs text-destructive mt-1" data-testid={`text-out-stock-${id}`}>Out of Stock</p>
        )}
      </div>
    </div>
  );
}
