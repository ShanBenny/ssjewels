import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import GlobalLoader from '../components/GlobalLoader';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            is_admin: profile.is_admin
          });
        }
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            is_admin: false
          });
        }
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <GlobalLoader isOpen={isLoading} message="Authenticating..." />
      <div className="w-full max-w-md bg-[var(--card-bg)] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[var(--color-border)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-[var(--color-navy)] dark:text-[var(--color-gold)]">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[var(--color-text)] opacity-70 text-sm mt-2">
            {isLogin ? 'Sign in to access your account' : 'Sign up for exclusive offers and faster checkout'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] opacity-70 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--color-text)] border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                  placeholder="John Doe"
                />
                <UserIcon className="absolute left-3 top-3.5 text-[var(--color-text)] opacity-50" size={18} />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] opacity-70 uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--color-text)] border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                placeholder="you@example.com"
              />
              <Mail className="absolute left-3 top-3.5 text-[var(--color-text)] opacity-50" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] opacity-70 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-sm border bg-[var(--card-bg)] text-[var(--color-text)] border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all"
                placeholder="••••••••"
                minLength={6}
              />
              <Lock className="absolute left-3 top-3.5 text-[var(--color-text)] opacity-50" size={18} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-gold)] hover:bg-[#c9a52e] text-[#000000] px-6 py-4 rounded-md font-medium transition-all duration-300 uppercase tracking-wider text-sm mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text)] opacity-70">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[var(--color-navy)] dark:text-[var(--color-gold)] hover:underline font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
