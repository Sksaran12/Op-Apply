import React, { useState } from 'react';
import { useAppStore } from '../store/store';

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, googleLogin } = useAppStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (tab === 'login') {
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.message);
      }
    } else {
      const res = await register(email, password, fullName);
      if (res.success) {
        setSuccess(res.message || 'Check email for verification token.');
        // Auto switch to login tab
        setTimeout(() => setTab('login'), 2000);
      } else {
        setError(res.message);
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    // Simulate a Google Authentication payload
    const mockEmail = `candidate.${Math.floor(100 + Math.random() * 900)}@gmail.com`;
    const mockName = 'Test Candidate';
    const mockGoogleId = `google_id_${Math.floor(100000 + Math.random() * 900000)}`;

    const res = await googleLogin(mockEmail, mockName, mockGoogleId);
    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-slate-950/45 border border-white/[0.08] hover:border-white/[0.15] rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all duration-300";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop blur */}
      <div 
        className="absolute inset-0 bg-[#020308]/80 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Modal Box with Static Obsidian Dark Theme */}
      <div className="relative w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl glass-panel bg-slate-950 border border-white/[0.08] text-slate-100 z-10 font-body">
        <button 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="font-heading text-3xl font-bold text-saffron mb-1">OP.Apply</div>
          <p className="text-xs text-slate-400">Unified Examination Application Gateway</p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/[0.06] mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 font-heading font-semibold text-lg border-b-2 transition-all ${tab === 'login' ? 'text-saffron border-saffron' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 font-heading font-semibold text-lg border-b-2 transition-all ${tab === 'signup' ? 'text-saffron border-saffron' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className={inputClass}
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className={inputClass}
              placeholder="applicant@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              className={inputClass}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-bold py-3.5 rounded-xl transition-all duration-300 font-heading uppercase tracking-wider shadow-lg shadow-saffron/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : tab === 'login' ? 'Login' : 'Register Now'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.06]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-3 text-slate-400 font-semibold">Or</span>
          </div>
        </div>

        {/* Google OAuth Simulation Button */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-navy py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
          By signing in, you agree to our <a href="#" className="text-saffron hover:underline font-semibold">Terms of Service</a> and <a href="#" className="text-saffron hover:underline font-semibold">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
