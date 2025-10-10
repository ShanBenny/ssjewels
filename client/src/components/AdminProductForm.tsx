import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useState } from "react";

interface AdminProductFormProps {
  product?: {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
  };
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function AdminProductForm({ product, onSubmit, onCancel }: AdminProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'necklaces');
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [description, setDescription] = useState(product?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, category, price, stock, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="image">Product Image</Label>
        <div className="mt-2 border-2 border-dashed rounded-md p-8 text-center hover-elevate">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <Input
            id="image"
            type="file"
            className="hidden"
            accept="image/*"
            data-testid="input-product-image"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Traditional Gold Necklace"
          data-testid="input-product-name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger data-testid="select-product-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="necklaces">Necklaces</SelectItem>
            <SelectItem value="bangles">Bangles</SelectItem>
            <SelectItem value="earrings">Earrings</SelectItem>
            <SelectItem value="rings">Rings</SelectItem>
            <SelectItem value="chokers">Chokers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            data-testid="input-product-price"
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            data-testid="input-product-stock"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the product..."
          rows={4}
          data-testid="textarea-product-description"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-save-product">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
