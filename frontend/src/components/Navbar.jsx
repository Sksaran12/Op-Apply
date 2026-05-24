import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenAuth, onNavigate }) {
  const { isAuthenticated, logout, user } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNav = (action) => {
    setMobileMenuOpen(false);
    if (typeof action === 'function') {
      action();
    } else if (action === 'home' || action === 'dashboard') {
      onNavigate(action);
    }
  };

  const navLinks = [
    { label: 'Home', action: 'home' },
    { label: 'Exams', href: '#exams' },
    { label: 'Workflow', href: '#how-it-works' },
    { label: 'Features', href: '#features' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#04060E]/85 backdrop-blur-xl py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] border-b border-white/[0.06]' 
        : 'bg-transparent py-5 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Brand Logo with Premium Saffron Gradient */}
        <div 
          className="font-heading text-2xl font-bold flex items-center gap-2.5 cursor-pointer select-none active:scale-95 transition-transform"
          onClick={() => handleMobileNav('home')}
        >
          <img src="/logo.png" alt="OP.Apply Logo" className="h-9 w-9 rounded-lg border border-white/[0.08] shadow-md shadow-saffron/5 object-cover" />
          <span className="tracking-wide uppercase bg-gradient-to-r from-saffron via-amber-400 to-saffron bg-clip-text text-transparent font-extrabold font-heading">
            OP.Apply
          </span>
        </div>

        {/* Desktop Navigation Links with animated underlines */}
        <nav className="hidden md:flex items-center gap-8 font-heading text-lg font-medium">
          {navLinks.map((link) => {
            const Tag = link.href ? 'a' : 'button';
            const actionProps = link.href 
              ? { href: link.href }
              : { onClick: () => onNavigate(link.action) };
            
            return (
              <Tag
                key={link.label}
                {...actionProps}
                className="text-slate-300 hover:text-saffron transition-all duration-300 hover:-translate-y-0.5 active:scale-95 relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-saffron to-amber-500 transition-all duration-300 group-hover:w-full" />
              </Tag>
            );
          })}
        </nav>

        {/* Right side CTA / Actions (Desktop only) */}
        <div className="hidden md:flex items-center gap-4 font-heading text-base font-semibold">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="bg-gradient-to-r from-saffron/10 to-amber-500/10 border border-saffron/30 hover:border-saffron/60 text-saffron px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,153,51,0.25)]"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                Dashboard
              </button>
              <button 
                onClick={logout}
                className="text-slate-400 hover:text-red-400 px-3.5 py-2 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-lg flex items-center justify-center">logout</span>
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={onOpenAuth}
                className="text-slate-300 hover:text-saffron transition-all hover:scale-105 px-3 py-2"
              >
                Login
              </button>
              <button 
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy px-7 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-saffron/20 hover:shadow-saffron/45 font-bold"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 hover:text-saffron transition-all active:scale-90"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined block text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-full left-0 w-full bg-[#04060E]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl md:hidden overflow-hidden z-40"
          >
            <div className="px-6 py-8 flex flex-col gap-6 font-heading text-lg font-semibold">
              {navLinks.map((link, idx) => {
                const Tag = link.href ? 'a' : 'button';
                const actionProps = link.href 
                  ? { href: link.href, onClick: () => setMobileMenuOpen(false) }
                  : { onClick: () => handleMobileNav(link.action) };

                return (
                  <motion.div
                    key={link.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Tag
                      {...actionProps}
                      className="text-slate-300 hover:text-saffron transition-colors block py-2 text-left w-full"
                    >
                      {link.label}
                    </Tag>
                  </motion.div>
                );
              })}

              <div className="h-px bg-white/[0.08] my-2" />

              {/* Action buttons inside mobile drawer */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="flex flex-col gap-4"
              >
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => handleMobileNav('dashboard')}
                      className="w-full bg-gradient-to-r from-saffron/10 to-amber-500/10 border border-saffron/30 text-saffron py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-saffron/20 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">dashboard</span>
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleMobileNav(logout)}
                      className="w-full border border-red-500/20 text-red-400 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/10 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleMobileNav(onOpenAuth)}
                      className="w-full border border-white/[0.08] text-slate-300 py-3 rounded-xl flex items-center justify-center hover:bg-white/[0.03] active:scale-95 transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleMobileNav(onOpenAuth)}
                      className="w-full bg-gradient-to-r from-saffron to-amber-500 text-navy font-bold py-3.5 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-md shadow-saffron/15"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
