import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import { useAppStore } from './store/store';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'dashboard'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { isAuthenticated, checkSession, authLoading, logout } = useAppStore();

  useEffect(() => {
    const isTabActive = sessionStorage.getItem('tabActive');
    if (!isTabActive) {
      // New tab session: clear residual session cookies/data
      sessionStorage.setItem('tabActive', 'true');
      logout().then(() => {
        checkSession();
      });
    } else {
      // Existing tab refresh/navigation: check current session
      checkSession();
    }
    // Statically force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const handleNavigate = (page) => {
    if (page === 'dashboard' && !isAuthenticated) {
      // Route Guard: open modal if trying to access dashboard while unauthenticated
      setIsAuthOpen(true);
      return;
    }
    setCurrentPage(page);
  };

  const handleApplyExam = (examCode) => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
    } else {
      setCurrentPage('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#04060E] text-slate-100 selection:bg-saffron selection:text-navy font-body">
      {/* Universal Floating Header */}
      <Navbar 
        onOpenAuth={() => setIsAuthOpen(true)} 
        onNavigate={handleNavigate}
      />

      {/* Pages Router */}
      {currentPage === 'dashboard' && isAuthenticated ? (
        <DashboardPage />
      ) : (
        <LandingPage 
          onOpenAuth={() => setIsAuthOpen(true)}
          onApplyExam={handleApplyExam}
        />
      )}

      {/* Shared Auth Modal (Login / Sign Up) */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  );
}
