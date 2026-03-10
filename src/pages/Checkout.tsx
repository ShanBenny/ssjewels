import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { ShieldCheck, CreditCard, CheckCircle2, ArrowLeft, ShoppingBag, MessageCircle, Globe } from 'lucide-react';
import GlobalLoader from '../components/GlobalLoader';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'paypal' | 'whatsapp' | 'cod'>('razorpay');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (items.length === 0) newErrors.cart = 'Cart is empty';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitOrder = async () => {
    try {
      const addressString = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      
      const { data: orderDataRes, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.name,
          phone: formData.phone,
          address: addressString,
          total: totalPrice(),
          user_id: user ? user.id : null,
          status: 'pending'
        }])
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      const orderItems = items.map(item => ({
        order_id: orderDataRes.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      return { status: "success", orderId: orderDataRes.id };
    } catch (error) {
      console.error("Error submitting order:", error);
      return { status: "error" };
    }
  };

  const startRazorpayPayment = (totalAmount: number) => {
    setLoadingMessage('Redirecting to secure payment...');
    
    setTimeout(() => {
      // Simulate payment URL
      const paymentUrl = `https://razorpay.com/payment-link/dummy?amount=${totalAmount}`;
      
      // Open in new tab
      window.open(paymentUrl, "_blank");

      setLoadingMessage('Processing payment...');

      // Simulate success after a short delay, since we can't actually track the new tab
      setTimeout(async () => {
        setLoadingMessage('Submitting your order...');
        
        const res = await submitOrder();
        if (res.status === 'error') {
           alert("Something went wrong. Please try again.");
           setIsProcessing(false);
           return;
        }

        // Insert payment record
        await supabase.from('payments').insert([{
           order_id: res.orderId,
           payment_method: 'razorpay',
           amount: totalAmount,
           status: 'success'
        }]);

        // Update order status to paid
        await supabase.from('orders').update({ status: 'processing' }).eq('id', res.orderId);
        
        setCompletedOrder({
          items: [...items],
          total: totalPrice()
        });
        
        setIsProcessing(false);
        setIsSuccess(true);
        clearCart();
      }, 3000);
    }, 1500);
  };

  const handleCOD = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setLoadingMessage('Submitting your order...');

    const res = await submitOrder();
    if (res.status === 'error') {
       alert("Something went wrong. Please try again.");
       setIsProcessing(false);
       return;
    }
    
    // Insert payment record
    await supabase.from('payments').insert([{
       order_id: res.orderId,
       payment_method: 'cod',
       amount: totalPrice(),
       status: 'success'
    }]);

    // Update order status
    await supabase.from('orders').update({ status: 'processing' }).eq('id', res.orderId);

    setCompletedOrder({
      items: [...items],
      total: totalPrice()
    });
    
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
  };

  const handlePayPal = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setLoadingMessage('Redirecting to PayPal...');

    const res = await submitOrder();
    if (res.status === 'error') {
       alert("Something went wrong. Please try again.");
       setIsProcessing(false);
       return;
    }

    await supabase.from('payments').insert([{
       order_id: res.orderId,
       payment_method: 'paypal',
       amount: totalPrice(),
       status: 'pending' // pending manual confirmation
    }]);

    // Redirect to PayPal.me
    const paymentUrl = `https://www.paypal.com/paypalme/ssimitationjewels/${totalPrice()}`;
    window.open(paymentUrl, "_blank");

    setCompletedOrder({
      items: [...items],
      total: totalPrice()
    });
    
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
  };

  const handleWhatsApp = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setLoadingMessage('Preparing WhatsApp order...');

    const res = await submitOrder();
    if (res.status === 'error') {
       alert("Something went wrong. Please try again.");
       setIsProcessing(false);
       return;
    }

    await supabase.from('payments').insert([{
       order_id: res.orderId,
       payment_method: 'whatsapp',
       amount: totalPrice(),
       status: 'pending'
    }]);

    let msg = `*New Order Request*\n\n*Name*: ${formData.name}\n*Phone*: ${formData.phone}\n\n*Items*:\n`;
    items.forEach(item => {
      msg += `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
    });
    msg += `\n*Total*: ₹${totalPrice()}`;

    const waUrl = `https://wa.me/917022653390?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    setCompletedOrder({
      items: [...items],
      total: totalPrice()
    });
    
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (paymentMethod === 'cod') {
      await handleCOD();
      return;
    } else if (paymentMethod === 'paypal') {
      await handlePayPal();
      return;
    } else if (paymentMethod === 'whatsapp') {
      await handleWhatsApp();
      return;
    }
    
    setIsProcessing(true);
    setLoadingMessage('Preparing secure checkout...');

    // Start Razorpay flow
    startRazorpayPayment(totalPrice());
  };

  if (items.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  if (isSuccess && completedOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] px-4 py-12 transition-colors duration-300">
        <div className="w-24 h-24 bg-[var(--card-bg)] text-[var(--color-gold)] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-gold-900/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4 text-center">Order Confirmed!</h2>
        <p className="text-[var(--text-primary)] opacity-70 mb-8 text-center max-w-md font-light">
          Thank you for your purchase. Your order has been placed successfully and we'll send you a confirmation email shortly.
        </p>
        
        <div className="bg-[var(--card-bg)] rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[var(--border-color)] w-full max-w-lg mb-8">
          <h3 className="text-lg font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-4 pb-4 border-b border-[var(--border-color)] flex items-center gap-2">
            <ShoppingBag size={20} /> Order Summary
          </h3>
          <div className="space-y-4 mb-6">
            {completedOrder.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-[var(--color-text)] opacity-80">{item.quantity}x</span>
                  <span className="font-medium text-[var(--color-text)] line-clamp-1">{item.name}</span>
                </div>
                <span className="font-medium text-[var(--color-text)]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--color-border)] pt-4 flex justify-between items-center">
            <span className="font-bold text-[var(--color-text)] uppercase tracking-wider text-sm">Total Paid</span>
            <span className="text-xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">
              ₹{completedOrder.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <Link 
          to="/products"
          className="bg-[var(--color-gold)] text-[var(--color-navy)] px-8 py-4 rounded-sm font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 uppercase tracking-wider text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 transition-colors duration-300">
      <GlobalLoader isOpen={isProcessing} message={loadingMessage} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">Checkout</h1>
          <Link to="/cart" className="text-[var(--color-text)] opacity-70 hover:text-[var(--color-gold)] transition-colors flex items-center gap-2 text-sm uppercase tracking-wider">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--card-bg)] rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[var(--border-color)]">
              <h2 className="text-xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-6 flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
                <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] flex items-center justify-center text-xs font-sans">1</span>
                Shipping Details
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.cart && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-sm text-sm font-medium mb-6 border border-red-200 dark:border-red-800">
                    {errors.cart}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-[var(--text-primary)] opacity-70 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--text-primary)] ${errors.name ? 'border-red-500' : 'border-[var(--border-color)]'} focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-[var(--text-primary)] opacity-70 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--border-color)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-xs font-medium text-[var(--text-primary)] opacity-70 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--text-primary)] ${errors.phone ? 'border-red-500' : 'border-[var(--border-color)]'} focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all`}
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-xs font-medium text-[var(--text-primary)] opacity-70 uppercase tracking-wider mb-2">Delivery Address</label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--text-primary)] ${errors.address ? 'border-red-500' : 'border-[var(--border-color)]'} focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all resize-none`}
                      placeholder="House/Flat No., Street Name, Landmark"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-medium text-[var(--text-primary)] opacity-70 uppercase tracking-wider mb-2">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--border-color)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs font-medium text-[var(--text-primary)] opacity-70 uppercase tracking-wider mb-2">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--border-color)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-xs font-medium text-[var(--text-primary)] opacity-70 uppercase tracking-wider mb-2">PIN Code</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--border-color)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                      placeholder="400001"
                    />
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                  <h2 className="text-xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-6 flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
                    <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] flex items-center justify-center text-xs font-sans">2</span>
                    Payment Method
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Razorpay Card */}
                    <div 
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`bg-white dark:bg-black border rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-[var(--color-gold)] ring-2 ring-[var(--color-gold)] shadow-md transform scale-[1.01]' : 'border-[var(--color-border)] hover:border-[var(--color-gold)]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-[var(--color-gold)]' : 'border-gray-400'}`}>
                        {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-gold)]"></div>}
                      </div>
                      <div className="flex-grow">
                        <span className="font-semibold text-[var(--color-text)] block text-sm sm:text-base">Pay with Razorpay (India)</span>
                        <span className="text-xs text-[var(--color-text)] opacity-60">Credit/Debit Card, UPI, NetBanking</span>
                      </div>
                      <CreditCard className={`${paymentMethod === 'razorpay' ? 'text-[var(--color-gold)]' : 'text-[var(--color-text)] opacity-50'} shrink-0 transition-colors`} size={28} />
                    </div>

                    {/* PayPal Card */}
                    <div 
                      onClick={() => setPaymentMethod('paypal')}
                      className={`bg-white dark:bg-black border rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-blue-500 ring-2 ring-blue-500 shadow-md transform scale-[1.01]' : 'border-[var(--color-border)] hover:border-blue-500'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-blue-500' : 'border-gray-400'}`}>
                        {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                      </div>
                      <div className="flex-grow">
                        <span className="font-semibold text-[var(--color-text)] block text-sm sm:text-base">Pay with PayPal (International)</span>
                        <span className="text-xs text-[var(--color-text)] opacity-60">Fast, safe global payments</span>
                      </div>
                      <Globe className={`${paymentMethod === 'paypal' ? 'text-blue-500' : 'text-[var(--color-text)] opacity-50'} shrink-0 transition-colors`} size={28} />
                    </div>

                    {/* WhatsApp Card */}
                    <div 
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`bg-white dark:bg-black border rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'border-[#25D366] ring-2 ring-[#25D366] shadow-md transform scale-[1.01]' : 'border-[var(--color-border)] hover:border-[#25D366]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${paymentMethod === 'whatsapp' ? 'border-[#25D366]' : 'border-gray-400'}`}>
                        {paymentMethod === 'whatsapp' && <div className="w-2.5 h-2.5 rounded-full bg-[#25D366]"></div>}
                      </div>
                      <div className="flex-grow">
                        <span className="font-semibold text-[var(--color-text)] block text-sm sm:text-base">Order via WhatsApp</span>
                        <span className="text-xs text-[var(--color-text)] opacity-60">We will contact you for payment & manual confirmation</span>
                      </div>
                      <MessageCircle className={`${paymentMethod === 'whatsapp' ? 'text-[#25D366]' : 'text-[var(--color-text)] opacity-50'} shrink-0 transition-colors`} size={28} />
                    </div>

                    {/* COD Card */}
                    <div 
                      onClick={() => {
                         if (totalPrice() >= 1000) setPaymentMethod('cod');
                      }}
                      className={`bg-white dark:bg-black border rounded-xl p-5 flex items-center gap-4 transition-all ${totalPrice() < 1000 ? 'opacity-50 cursor-not-allowed border-[var(--color-border)]' : paymentMethod === 'cod' ? 'border-gray-500 ring-2 ring-gray-500 shadow-md transform scale-[1.01]' : 'border-[var(--color-border)] cursor-pointer hover:border-gray-500'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-gray-500' : 'border-gray-400'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div>}
                      </div>
                      <div className="flex-grow">
                        <span className="font-semibold text-[var(--color-text)] block text-sm sm:text-base">Cash on Delivery (COD)</span>
                        <span className="text-xs text-[var(--color-text)] opacity-60">
                          {totalPrice() < 1000 ? 'Only available for orders above ₹1,000' : 'Pay when you receive your order'}
                        </span>
                      </div>
                      <ShieldCheck className={`${paymentMethod === 'cod' ? 'text-gray-500' : 'text-[var(--color-text)] opacity-50'} shrink-0 transition-colors`} size={28} />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full mt-8 text-white px-6 py-4 rounded-xl font-bold hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 uppercase tracking-wider text-sm ${
                    paymentMethod === 'razorpay' ? 'bg-[var(--color-gold)] text-[var(--color-navy)]' :
                    paymentMethod === 'paypal' ? 'bg-blue-600' :
                    paymentMethod === 'whatsapp' ? 'bg-[#25D366]' :
                    'bg-gray-800 dark:bg-gray-300 dark:text-gray-900'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {paymentMethod === 'razorpay' && <CreditCard size={18} />}
                      {paymentMethod === 'paypal' && <Globe size={18} />}
                      {paymentMethod === 'whatsapp' && <MessageCircle size={18} />}
                      {paymentMethod === 'cod' && <ShieldCheck size={18} />}
                      
                      {paymentMethod === 'whatsapp' ? 'Send Order on WhatsApp' : `Pay ₹${totalPrice().toLocaleString('en-IN')}`}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)] rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[var(--border-color)] sticky top-24">
              <h2 className="text-xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)] mb-6 pb-4 border-b border-[var(--border-color)]">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 rounded-sm overflow-hidden shrink-0 bg-[var(--card-bg)] border border-[var(--border-color)] relative">
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                      <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-[var(--color-navy)] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h4 className="text-sm font-serif font-bold text-[var(--color-navy)] dark:text-gray-200 line-clamp-2 mb-1">{item.name}</h4>
                      <span className="text-xs text-[var(--color-text)] opacity-70 font-medium">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[var(--color-border)] pt-6 space-y-4 text-sm text-[var(--color-text)] opacity-80 mb-6 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[var(--color-text)] opacity-100">₹{totalPrice().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[var(--color-gold)]">Free</span>
                </div>
              </div>
              
              <div className="border-t border-[var(--color-border)] pt-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-[var(--color-text)] uppercase tracking-wider text-sm">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">
                      ₹{totalPrice().toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-[var(--color-text)] opacity-50 mt-1 uppercase tracking-widest">Including GST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
