import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { User as UserIcon, LogOut, Package } from 'lucide-react';
import GlobalLoader from '../components/GlobalLoader';

export default function Profile() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            product_id,
            products (name, image_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      setIsLoading(false);
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <GlobalLoader isOpen={isLoading} />
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Card */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <div className="w-20 h-20 bg-[var(--color-gold)] rounded-full flex items-center justify-center text-[var(--color-navy)] shrink-0">
              <UserIcon size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">
                {user.full_name || 'Valued Customer'}
              </h1>
              <p className="text-[var(--text-primary)] opacity-70 text-sm">{user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider text-xs font-medium border border-red-200 dark:border-red-900/30 px-4 py-2 rounded-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-6 flex items-center gap-3">
            <Package size={24} /> Order History
          </h2>
          
          {orders.length === 0 ? (
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-12 text-center text-[var(--text-primary)] opacity-70">
              You haven't placed any orders yet.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                  <div className="bg-white dark:bg-black p-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-sm">
                    <div>
                      <span className="text-[var(--text-primary)] opacity-70 block mb-1">Order Placed</span>
                      <span className="font-medium text-[var(--color-navy)] dark:text-gray-200">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-primary)] opacity-70 block mb-1">Total</span>
                      <span className="font-medium text-[var(--color-navy)] dark:text-gray-200">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-primary)] opacity-70 block mb-1">Order ID</span>
                      <span className="font-medium text-[var(--color-navy)] dark:text-gray-200 block max-w-[150px] truncate" title={order.id}>
                        {order.id}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-[var(--color-gold)]/20 text-[var(--color-gold-dark)]'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 space-y-4">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-16 h-20 bg-white dark:bg-black border border-[var(--border-color)] rounded-sm overflow-hidden shrink-0">
                          {item.products?.image_url ? (
                            <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"><Package size={20} className="text-gray-400" /></div>
                          )}
                        </div>
                        <div className="flex-grow flex flex-col justify-center">
                          <h4 className="text-sm font-medium text-[var(--color-navy)] dark:text-gray-200 line-clamp-2 mb-1">
                            {item.products?.name || 'Unknown Product'}
                          </h4>
                          <span className="text-xs text-[var(--text-primary)] opacity-70">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
