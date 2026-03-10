import { ShoppingCart, Heart, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Header() {
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary" data-testid="text-brand">
              SS Jewels
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" data-testid="link-home">Home</Button>
            <Button variant="ghost" data-testid="link-categories">Categories</Button>
            <Button variant="ghost" data-testid="link-new-arrivals">New Arrivals</Button>
            <Button variant="ghost" data-testid="link-about">About</Button>
          </div>

          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jewelry..."
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" data-testid="button-wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground"
                  data-testid="badge-wishlist-count"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground"
                  data-testid="badge-cart-count"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-account">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
