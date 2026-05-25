import React from 'react';
import { useAppStore } from '../store/store';

export default function Sidebar({ activeTab, setActiveTab, onOpenApplyModal, isOpen, onClose }) {
  const { profile, logout } = useAppStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'profile', label: 'Universal Profile', icon: 'assignment_ind' },
    { id: 'settings', label: 'Portal Settings', icon: 'settings' }
  ];

  const handleAction = (callback) => {
    if (callback) callback();
    if (onClose) onClose();
  };

  return (
    <aside className={`w-64 bg-slate-950/90 backdrop-blur-2xl border-r border-white/[0.05] shadow-2xl flex flex-col h-[calc(100vh-80px)] fixed top-20 left-0 pt-8 pb-6 z-30 transition-all duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Profile summary with glowing elements */}
      <div className="px-6 mb-8 flex flex-col items-center text-center">
        <div className="relative mb-3 flex items-center justify-center">
          {profile?.photoUrl ? (
            <img 
              src={profile.photoUrl} 
              alt="Applicant" 
              className="w-20 h-20 rounded-full object-cover ring-2 ring-saffron/30 p-1 border border-white/10 shadow-lg shadow-saffron/5"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 ring-2 ring-saffron/30 flex items-center justify-center shadow-lg shadow-saffron/5 text-saffron text-2xl font-bold font-heading">
              {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
          {profile?.isComplete && (
            <span className="absolute bottom-0 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-indiagreen to-emerald-400 ring-2 ring-slate-950 text-[10px] text-white font-bold">
              ✓
            </span>
          )}
        </div>
        <h4 className="font-heading text-lg text-slate-100 font-bold leading-tight truncate w-full px-2">
          {profile?.fullName || 'Academic Candidate'}
        </h4>
        <span className="text-xs text-slate-400 mt-1">
          ID: OP-2026-{(profile?._id || '9981').substring(0, 4).toUpperCase()}
        </span>
        
        {/* Profile Completion Badge */}
        <div className="w-full mt-4 bg-white/[0.06] rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indiagreen to-emerald-400 h-full rounded-full shadow-[0_0_12px_rgba(0,210,133,0.4)] transition-all duration-500"
            style={{ width: `${profile?.completionPercentage || 0}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 mt-1.5 font-semibold tracking-wide">
          Profile {profile?.completionPercentage || 0}% Complete
        </span>
      </div>

      {/* Primary Call to Action - Gradient Glow Pill Button */}
      <div className="px-6 mb-6">
        <button 
          onClick={() => handleAction(onOpenApplyModal)}
          className="w-full py-3 px-4 bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-heading font-bold text-base rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-saffron/20 hover:shadow-saffron/40 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Apply New Exam
        </button>
      </div>

      {/* Nav Menu Links with Glowing Active Fades */}
      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAction(() => setActiveTab(item.id))}
            className={`w-full px-6 py-3.5 flex items-center gap-3 font-heading font-medium text-base transition-all border-l-4 ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-saffron/15 to-transparent text-saffron border-saffron font-bold' 
                : 'text-slate-400 border-transparent hover:bg-white/[0.03] hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout button */}
      <div className="px-6 mt-auto">
        <button 
          onClick={() => handleAction(logout)}
          className="w-full py-3 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-400 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-heading font-semibold hover:scale-[1.01] active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
