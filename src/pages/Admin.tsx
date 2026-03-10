import React, { useState, useEffect, useMemo } from 'react';
import { Package, ShoppingBag, Users, Settings, Plus, Edit2, Trash2, X, Search, DollarSign, LayoutDashboard, Menu, Moon, Sun, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import GlobalLoader from '../components/GlobalLoader';
import { getSupabaseImageUrl } from '../lib/utils';

interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number | string;
  imageUrl: string;
  description: string;
  stock: number | string;
}

interface AdminOrder {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  items: string;
  totalPrice: number | string;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export default function Admin() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Jewellery',
    price: '',
    imageUrl: '',
    description: '',
    stock: ''
  });

  useEffect(() => {
    if (user && user.is_admin) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else if (session?.user) {
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
      if (data && data.is_admin) {
        setIsLoggedIn(true);
        fetchData();
      } else {
        alert("Access Denied: You don't have admin privileges.");
        await supabase.auth.signOut();
      }
    }
    setIsLoading(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: prodData } = await supabase.from('products').select('*');
      const { data: ordData } = await supabase.from('orders').select('*');
      const { data: itemsData } = await supabase.from('order_items').select('*');
      const { data: paymentsData } = await supabase.from('payments').select('*');
      
      if (prodData) {
        setProducts(prodData.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category_id || p.category || 'Uncategorized',
          price: p.price,
          imageUrl: p.image_url || '',
          description: p.description || '',
          stock: p.stock || 0
        })));
      }

      if (ordData) {
        setOrders(ordData.map((o: any) => {
          const oItems = itemsData ? itemsData.filter((i: any) => i.order_id === o.id) : [];
          const itemsString = oItems.map((i: any) => {
             const p = prodData ? prodData.find((prod:any) => prod.id === i.product_id) : null;
             const pName = p ? p.name : 'Unknown Product';
             return `${pName} (x${i.quantity})`;
          }).join(', ');
          const payment = paymentsData ? paymentsData.find((p: any) => p.order_id === o.id) : null;

          return {
            id: o.id,
            date: o.created_at ? new Date(o.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
            customerName: o.customer_name || 'Unknown',
            phone: o.phone || '',
            address: o.address || '',
            items: itemsString || 'No items listed',
            totalPrice: o.total || 0,
            status: o.status || 'pending',
            paymentMethod: payment ? payment.payment_method : 'N/A',
            paymentStatus: payment ? payment.status : 'N/A'
          };
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingProduct) {
        const { error } = await supabase.from('products').update({
          name: productForm.name,
          category_id: productForm.category,
          price: parseFloat(productForm.price),
          image_url: productForm.imageUrl,
          description: productForm.description,
          stock: parseInt(productForm.stock, 10) || 0
        }).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        // If image is a File, we'd upload it. For now assuming form has image URL or File
        // Here we just save the URL since the input is type url.
        // If it's a file upload, we'd use supabase.storage.from('products').upload(...)
        // Since we are preserving the form structure, we'll keep it as URL for now.
        const { error } = await supabase.from('products').insert([{
          name: productForm.name,
          category_id: productForm.category,
          price: parseFloat(productForm.price),
          image_url: productForm.imageUrl,
          description: productForm.description,
          stock: parseInt(productForm.stock, 10) || 0
        }]);
        if (error) throw error;
      }
      
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    } finally {
      setIsSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Jewellery', price: '', imageUrl: '', description: '', stock: '' });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      category: product.category || 'Jewellery',
      price: product.price?.toString() || '',
      imageUrl: product.imageUrl || '',
      description: product.description || '',
      stock: product.stock?.toString() || ''
    });
    setIsProductModalOpen(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
       console.error('Error updating order status:', error);
       alert('Failed to update order status');
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Derived dashboard metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => {
    const p = parseFloat(order.totalPrice?.toString() || '0');
    return acc + (isNaN(p) ? 0 : p);
  }, 0);
  const lowStockItems = products.filter(p => {
    const s = parseInt(p.stock?.toString() || '0');
    return !isNaN(s) && s < 5;
  }).length;

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || o.id?.toString().includes(searchQuery));
  }, [orders, searchQuery]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 transition-colors duration-300">
        <div className="bg-[#F9F9F9] dark:bg-[#1A1A1A] p-8 rounded-xl shadow-sm border border-[var(--color-border)] w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-dark)] rounded-sm flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold-900/20">
              <span className="text-[#111111] font-serif font-bold text-3xl">SS</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">Admin Portal</h2>
            <p className="text-[var(--color-text)] opacity-70 text-xs uppercase tracking-widest mt-2">Enter your credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] opacity-70 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm border bg-white dark:bg-black text-[var(--color-text)] border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                placeholder="admin@ssjewels.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] opacity-70 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm border bg-white dark:bg-black text-[var(--color-text)] border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)] dark:bg-[var(--color-gold)] dark:hover:bg-[var(--color-gold-light)] text-white dark:text-[#111111] px-6 py-4 rounded-md font-medium transition-all duration-300 uppercase tracking-wider text-sm mt-4 shadow-md"
            >
              Sign In
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text)] opacity-60 font-mono">
            <p className="mb-2 uppercase tracking-widest text-[10px]">Demo Credentials</p>
            <p>admin@ssjewels.com / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#111214] flex transition-colors duration-300 font-sans text-[var(--color-text)]">

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-[var(--card-bg)] border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out flex flex-col w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="w-8 h-8 bg-black dark:bg-[#e3b34c] rounded flex items-center justify-center mr-3 shadow-sm">
            <span className="text-white dark:text-black font-serif font-bold text-sm">SS</span>
          </div>
          <span className="font-bold text-lg text-[var(--text-primary)]">Admin Panel</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <button onClick={() => { setActiveTab('dashboard'); if (window.innerWidth < 768) setSidebarOpen(false); }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'}`}>
            <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('products'); if (window.innerWidth < 768) setSidebarOpen(false); }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'products' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'}`}>
            <Package className="mr-3 h-5 w-5" /> Products
          </button>
          <button onClick={() => { setActiveTab('orders'); if (window.innerWidth < 768) setSidebarOpen(false); }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'}`}>
            <ShoppingBag className="mr-3 h-5 w-5" /> Orders
          </button>
          <button onClick={() => { setActiveTab('customers'); if (window.innerWidth < 768) setSidebarOpen(false); }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'customers' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'}`}>
            <Users className="mr-3 h-5 w-5" /> Customers
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#1a1c1e]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md mr-2">
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-[var(--text-primary)] capitalize">{activeTab}</h1>
            {isLoading && <Loader2 className="ml-4 h-5 w-5 text-gray-400 animate-spin" />}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-md leading-5 bg-[var(--color-bg)] text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white sm:text-sm transition-colors"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-700 to-black dark:from-[#e3b34c] dark:to-[#b38520] flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {searchQuery && (
            <div className="sm:hidden mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-md leading-5 bg-[var(--color-bg)] text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white sm:text-sm"
              />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm border border-[var(--border-color)]">
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Products</h3>
                    <Package className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{totalProducts}</div>
                </div>

                <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm border border-[var(--border-color)]">
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Orders</h3>
                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{totalOrders}</div>
                </div>

                <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm border border-[var(--border-color)]">
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Revenue</h3>
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">₹{totalRevenue.toLocaleString('en-IN')}</div>
                </div>

                <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm border border-[var(--border-color)]">
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)]">Low Stock Items</h3>
                    <AlertCircle className="h-4 w-4 gap-2 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{lowStockItems}</div>
                </div>
              </div>

              {/* Dashboard Content Placeholders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm border border-[var(--border-color)] h-96 flex items-center justify-center">
                  <p className="text-[var(--text-secondary)] italic text-sm">Sales chart will appear here.</p>
                </div>
                <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">View all</button>
                  </div>
                  <div className="flex-1 overflow-auto p-0">
                    {orders.length === 0 ? (
                      <div className="p-6 text-center text-[var(--text-secondary)] text-sm">No recent orders found.</div>
                    ) : (
                      <ul className="divide-y divide-[var(--border-color)]">
                        {orders.slice(0, 5).map((o, i) => (
                          <li key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">{o.customerName}</p>
                              <p className="text-xs text-[var(--text-secondary)]">{o.date}</p>
                            </div>
                            <span className="text-sm font-semibold text-[var(--text-primary)]">₹{o.totalPrice}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Products Management</h2>
                <button onClick={openAddModal} className="bg-black hover:bg-gray-800 text-white dark:bg-[#e3b34c] dark:text-black dark:hover:bg-[#c99f43] px-4 py-2 rounded-md font-medium shadow-sm flex items-center gap-2 text-sm transition-colors">
                  <Plus size={16} /> Add Product
                </button>
              </div>

              <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border-color)]">
                    <thead className="bg-[var(--color-bg)]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Stock</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)]">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-sm text-[var(--text-secondary)]">
                            {isLoading ? 'Loading products...' : 'No products found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product, idx) => (
                          <tr key={product.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-12 w-12 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden border border-[var(--border-color)]">
                                  {product.imageUrl ? (
                                    <img className="h-full w-full object-cover" src={getSupabaseImageUrl(product.imageUrl)} alt={product.name} referrerPolicy="no-referrer" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center"><Package size={20} className="text-gray-400" /></div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-[var(--text-primary)]">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                              ₹{product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parseInt(product.stock?.toString() || '0') > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  parseInt(product.stock?.toString() || '0') > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                {product.stock} in stock
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => openEditModal(product)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3 transition-colors">
                                Edit
                              </button>
                              <button onClick={() => deleteProduct(product.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Orders Management</h2>
              </div>

              <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border-color)]">
                    <thead className="bg-[var(--color-bg)]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Contact</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Ordered Items</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Payment Details</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-sm text-[var(--text-secondary)]">
                            {isLoading ? 'Loading orders...' : 'No orders found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order, idx) => (
                          <tr key={order.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                              {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-[var(--text-primary)]">{order.customerName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[var(--text-primary)]">{order.phone}</div>
                              <div className="text-xs text-[var(--text-secondary)] max-w-[200px] truncate" title={order.address}>{order.address}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)] max-w-xs">
                              <div className="truncate" title={order.items}>{order.items}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-[var(--text-primary)] uppercase">{order.paymentMethod}</div>
                              <div className="text-xs text-[var(--text-secondary)] mt-1 capitalize">{order.paymentStatus}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="text-sm border-gray-300 rounded-md bg-white dark:bg-gray-800 text-[var(--text-primary)] px-2 py-1 outline-none"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-[var(--text-primary)]">
                              ₹{order.totalPrice}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="flex flex-col items-center justify-center p-12 text-center h-96 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border-color)] mt-6">
              <Users size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Customers Module</h3>
              <p className="text-[var(--text-secondary)] max-w-sm">This module is under development and will be available in the next release.</p>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal overlay */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-80 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-[var(--card-bg)] rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-200 dark:border-gray-800">
              <form onSubmit={submitProduct}>
                <div className="bg-[var(--card-bg)] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-5 pb-4 border-b border-[var(--border-color)]">
                    <h3 className="text-lg leading-6 font-medium text-[var(--text-primary)]">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                      <input type="text" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-black text-[var(--text-primary)] focus:outline-none focus:ring-black focus:border-black dark:focus:ring-[#e3b34c] dark:focus:border-[#e3b34c] sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-black text-[var(--text-primary)] focus:outline-none focus:ring-black focus:border-black dark:focus:ring-[#e3b34c] dark:focus:border-[#e3b34c] sm:text-sm cursor-pointer">
                          <option value="Jewellery">Jewellery</option>
                          <option value="Sarees">Sarees</option>
                          <option value="Home Items">Home Items</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                        <input type="number" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-black text-[var(--text-primary)] focus:outline-none focus:ring-black focus:border-black dark:focus:ring-[#e3b34c] dark:focus:border-[#e3b34c] sm:text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                        <input type="number" required value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-black text-[var(--text-primary)] focus:outline-none focus:ring-black focus:border-black dark:focus:ring-[#e3b34c] dark:focus:border-[#e3b34c] sm:text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                        <input type="url" required value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} placeholder="https://..." className="w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-black text-[var(--text-primary)] focus:outline-none focus:ring-black focus:border-black dark:focus:ring-[#e3b34c] dark:focus:border-[#e3b34c] sm:text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea rows={3} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-black text-[var(--text-primary)] focus:outline-none focus:ring-black focus:border-black dark:focus:ring-[#e3b34c] dark:focus:border-[#e3b34c] sm:text-sm"></textarea>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--color-bg)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-xl border-t border-gray-200 dark:border-gray-800">
                  <button type="submit" disabled={isSaving} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black dark:bg-[#e3b34c] text-base font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-[#c99f43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-[#e3b34c] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors">
                    {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Product'}
                  </button>
                  <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-[var(--card-bg)] text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-[#e3b34c] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Global Saving state */}
      <GlobalLoader isOpen={isSaving && !isProductModalOpen} message="Processing..." />
    </div>
  );
}
