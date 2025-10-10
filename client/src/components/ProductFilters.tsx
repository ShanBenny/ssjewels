import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 5000]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Category</h3>
        <Select defaultValue="all">
          <SelectTrigger data-testid="select-category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="necklaces">Necklaces</SelectItem>
            <SelectItem value="bangles">Bangles</SelectItem>
            <SelectItem value="earrings">Earrings</SelectItem>
            <SelectItem value="rings">Rings</SelectItem>
            <SelectItem value="chokers">Chokers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Sort By</h3>
        <Select defaultValue="featured">
          <SelectTrigger data-testid="select-sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="new">New Arrivals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={5000}
          step={100}
          className="mb-2"
          data-testid="slider-price"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span data-testid="text-min-price">₹{priceRange[0]}</span>
          <span data-testid="text-max-price">₹{priceRange[1]}</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" data-testid="button-reset-filters">
        Reset Filters
      </Button>
    </div>
  );
}
