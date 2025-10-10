import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AdminProductForm from "@/components/AdminProductForm";
import ThemeToggle from "@/components/ThemeToggle";
import { Plus, Edit, Trash2, Package } from "lucide-react";

import necklaceImg from "@assets/stock_images/elegant_traditional__f8f6bf4e.jpg";

export default function Admin() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const products = [
    { id: "1", name: "Traditional Gold Necklace Set", category: "Necklaces", price: 2499, stock: 15, image: necklaceImg },
    { id: "2", name: "Elegant Choker Design", category: "Chokers", price: 1899, stock: 8, image: necklaceImg },
    { id: "3", name: "Classic Gold Bangles", category: "Bangles", price: 1599, stock: 0, image: necklaceImg },
  ];

  const orders = [
    { id: "1", orderNumber: "12345", customer: "John Doe", total: 4998, status: "delivered" as const, date: "Dec 15, 2024" },
    { id: "2", orderNumber: "12346", customer: "Jane Smith", total: 1899, status: "shipped" as const, date: "Dec 18, 2024" },
    { id: "3", orderNumber: "12347", customer: "Bob Johnson", total: 1599, status: "processing" as const, date: "Dec 20, 2024" },
  ];

  const statusConfig = {
    processing: { label: 'Processing', variant: 'default' as const },
    shipped: { label: 'Shipped', variant: 'default' as const },
    delivered: { label: 'Delivered', variant: 'default' as const },
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-primary" data-testid="text-admin-title">
            Admin Dashboard
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            data-testid="tab-products"
          >
            <Package className="h-4 w-4 mr-2" />
            Products
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
            data-testid="tab-orders"
          >
            Orders
          </Button>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold" data-testid="text-products-header">Products</h2>
              <Button onClick={() => setShowProductForm(true)} data-testid="button-add-product">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Image</th>
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-left p-4 font-semibold">Price</th>
                    <th className="text-left p-4 font-semibold">Stock</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className="hover-elevate" data-testid={`product-row-${product.id}`}>
                      <td className="p-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                      </td>
                      <td className="p-4" data-testid={`text-product-name-${product.id}`}>{product.name}</td>
                      <td className="p-4 text-muted-foreground">{product.category}</td>
                      <td className="p-4 font-accent font-semibold">₹{product.price}</td>
                      <td className="p-4">
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" data-testid={`button-edit-${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-delete-${product.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6" data-testid="text-orders-header">Customer Orders</h2>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Order #</th>
                    <th className="text-left p-4 font-semibold">Customer</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Total</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover-elevate" data-testid={`order-row-${order.id}`}>
                      <td className="p-4 font-medium" data-testid={`text-order-number-${order.id}`}>{order.orderNumber}</td>
                      <td className="p-4">{order.customer}</td>
                      <td className="p-4 text-muted-foreground">{order.date}</td>
                      <td className="p-4 font-accent font-semibold">₹{order.total}</td>
                      <td className="p-4">
                        <Badge variant={statusConfig[order.status].variant}>
                          {statusConfig[order.status].label}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <AdminProductForm
            onSubmit={(data) => {
              console.log('Product submitted:', data);
              setShowProductForm(false);
            }}
            onCancel={() => setShowProductForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
