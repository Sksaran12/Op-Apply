import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/store';
import Sidebar from '../components/Sidebar';
import ProfileEdit from '../components/ProfileEdit';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'profile', 'settings'
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [feedback, setFeedback] = useState({ success: '', error: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    profile,
    fetchProfile,
    applications,
    fetchApplications,
    exams,
    fetchExams,
    notifications,
    fetchNotifications,
    markNotificationRead,
    submitApplication,
    applicationsLoading
  } = useAppStore();

  useEffect(() => {
    fetchProfile();
    fetchApplications();
    fetchExams();
    fetchNotifications();
  }, []);

  const handleApplySubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFeedback({ success: '', error: '' });

    if (!selectedExamId) {
      setFeedback({ success: '', error: 'Please select an examination' });
      return;
    }

    const res = await submitApplication(selectedExamId);
    if (res.success) {
      setFeedback({ success: 'Application registered as Applied! Opened the official main office website.', error: '' });
      setSelectedExamId('');
      // Auto close after 2 seconds
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setFeedback({ success: '', error: '' });
      }, 2000);
    } else {
      setFeedback({ success: '', error: res.message });
    }
  };

  const handleDownloadAdmitCard = (appId) => {
    // Open in a new tab to trigger the PDF download stream
    window.open(`/api/applications/${appId}/admit-card`, '_blank');
  };

  // Get status badge classes
  const getStatusBadge = (status) => {
    const maps = {
      APPLIED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      SUBMITTED: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
      UNDER_REVIEW: 'bg-saffron/10 text-saffron border-saffron/25',
      APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      REJECTED: 'bg-red-500/10 text-red-400 border-red-500/25',
      ADMIT_CARD_ISSUED: 'bg-purple-500/10 text-purple-400 border-purple-500/25'
    };
    return maps[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/25';
  };

  // Calculate upcoming exams
  const upcomingExamsCount = exams.filter(e => new Date(e.examDate) > new Date()).length;

  return (
    <div className="min-h-screen bg-[#04060E] text-slate-100 font-body pt-20 transition-all duration-300">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenApplyModal={() => setIsApplyModalOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#020308]/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating Menu Action Button for mobile sidebar toggling */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy p-4 rounded-full shadow-lg shadow-saffron/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border border-saffron/30"
        aria-label="Open Sidebar Navigation"
      >
        <span className="material-symbols-outlined text-2xl font-fill">menu_open</span>
      </button>

      {/* Main Container */}
      <div className="md:ml-64 p-6 md:p-10 max-w-6xl mx-auto min-h-[calc(100vh-80px)]">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header Greeting */}
            <div>
              <h1 className="font-heading text-4xl font-extrabold mb-2 text-white">Applicant Dashboard</h1>
              <p className="text-slate-400 text-sm font-medium">Welcome back, <span className="text-saffron font-bold">{profile?.fullName || 'Candidate'}</span>. Manage your national exams below.</p>
            </div>

            {/* Top Stats Row with Glowing Borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel bg-slate-950/45 border-l-4 border-saffron p-6 rounded-2xl flex items-center justify-between shadow-lg hover:shadow-saffron/5 transition-all duration-300">
                <div>
                  <span className="text-xs text-slate-400 font-heading uppercase tracking-widest font-bold">Total Submissions</span>
                  <div className="text-4xl font-black text-white font-heading mt-1">{applications.length}</div>
                </div>
                <span className="material-symbols-outlined text-4xl text-saffron">folder_shared</span>
              </div>

              <div className="glass-panel bg-slate-950/45 border-l-4 border-emerald-400 p-6 rounded-2xl flex items-center justify-between shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                <div>
                  <span className="text-xs text-slate-400 font-heading uppercase tracking-widest font-bold">Upcoming Papers</span>
                  <div className="text-4xl font-black text-white font-heading mt-1">{upcomingExamsCount}</div>
                </div>
                <span className="material-symbols-outlined text-4xl text-emerald-400">event_upcoming</span>
              </div>

              <div className="glass-panel bg-slate-950/45 border-l-4 border-red-500 p-6 rounded-2xl flex items-center justify-between shadow-lg hover:shadow-red-500/5 transition-all duration-300">
                <div>
                  <span className="text-xs text-slate-400 font-heading uppercase tracking-widest font-bold">Notifications</span>
                  <div className="text-4xl font-black text-white font-heading mt-1">
                    {notifications.filter(n => !n.isRead).length}
                  </div>
                </div>
                <span className="material-symbols-outlined text-4xl text-red-500">notifications_active</span>
              </div>
            </div>

            {/* Main grid splitter */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Applications Feed */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel bg-slate-950/45 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
                  <div className="px-6 py-5 bg-white/[0.02] border-b border-white/[0.06] flex justify-between items-center">
                    <h3 className="font-heading text-xl font-bold text-white">Applications & Admit Cards</h3>
                  </div>

                  {applications.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <span className="material-symbols-outlined text-5xl mb-3 text-slate-600">folder_open</span>
                      <p>You haven't submitted any applications yet.</p>
                      <button 
                        onClick={() => setIsApplyModalOpen(true)}
                        className="text-saffron hover:underline mt-2 font-bold font-heading text-sm"
                      >
                        Apply for your first exam
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-white/[0.02] text-slate-400 font-heading text-sm uppercase tracking-wider border-b border-white/[0.06]">
                          <tr>
                            <th className="px-6 py-4">Examination</th>
                            <th className="px-6 py-4">Ref Number</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Admit Card</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05] text-sm font-body">
                          {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-100">
                                {app.exam.name}
                              </td>
                              <td className="px-6 py-4 font-mono text-slate-400">{app.applicationNumber}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                                  {app.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {(app.status === 'APPROVED' || app.status === 'ADMIT_CARD_ISSUED') ? (
                                  <button
                                    onClick={() => handleDownloadAdmitCard(app.id)}
                                    className="bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy px-4 py-2 rounded-lg font-heading font-bold text-xs hover:scale-105 active:scale-95 transition-all duration-300 shadow-md shadow-saffron/20 hover:shadow-saffron/40 flex items-center gap-1.5"
                                  >
                                    <span className="material-symbols-outlined text-xs">download</span>
                                    Get PDF
                                  </button>
                                ) : (
                                  <span className="text-xs text-slate-500 font-semibold italic">Awaiting Issue</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Feed */}
              <div className="space-y-6">
                
                {/* Profile Completion Panel */}
                <div className="glass-panel bg-slate-950/45 border border-white/[0.08] p-6 rounded-2xl">
                  <h3 className="font-heading text-lg font-bold mb-4 text-white">Universal Profile Index</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      {/* Circular Progress SVG */}
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" className="stroke-white/[0.05] fill-none" strokeWidth="4" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          className="stroke-emerald-400 fill-none transition-all duration-500" 
                          strokeWidth="4" 
                          strokeDasharray={176} 
                          strokeDashoffset={176 - (176 * (profile?.completionPercentage || 0)) / 100}
                        />
                      </svg>
                      <span className="absolute font-heading font-extrabold text-sm text-white">{profile?.completionPercentage || 0}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        {profile?.completionPercentage === 100 ? 'Verification Complete' : 'Profile Incomplete'}
                      </p>
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className="text-xs text-saffron hover:underline font-bold mt-0.5"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications Alert Board */}
                <div className="glass-panel bg-slate-950/45 border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col max-h-[300px]">
                  <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-white">Admissions Alerts</h3>
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="p-4 divide-y divide-white/[0.05] overflow-y-auto flex-1 font-body">
                    {notifications.length === 0 ? (
                      <div className="text-center text-xs text-slate-500 py-8">
                        No recent notifications.
                      </div>
                    ) : (
                      notifications.map((note) => {
                        const tokenMatch = note.message.match(/verify_token_([a-f0-9]+)/);
                        const verificationToken = tokenMatch ? tokenMatch[1] : null;

                        return (
                          <div 
                            key={note.id} 
                            className={`py-3 flex justify-between items-start gap-2 ${!note.isRead ? 'bg-white/[0.03] -mx-4 px-4 border-l-2 border-saffron' : ''}`}
                          >
                            <div className="flex-1">
                              <p className="text-xs font-bold text-saffron">{note.title}</p>
                              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                                {verificationToken 
                                  ? note.message.split('verify_token_')[0] + 'Verification System'
                                  : note.message
                                }
                              </p>

                              {verificationToken && !note.isRead && (
                                <button
                                  onClick={async () => {
                                    try {
                                      const res = await fetch(`/api/auth/verify-email/${verificationToken}`);
                                      const data = await res.json();
                                      if (res.ok) {
                                        alert(data.message || 'Verification successful!');
                                        await markNotificationRead(note.id);
                                        useAppStore.getState().checkSession();
                                      } else {
                                        alert(data.message || 'Verification failed.');
                                      }
                                    } catch (err) {
                                      console.error(err);
                                      alert('Failed to verify.');
                                    }
                                  }}
                                  className="mt-2 bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy px-3 py-1 rounded font-heading font-extrabold text-[10px] uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-md shadow-saffron/10"
                                >
                                  Verify Email Now
                                </button>
                              )}

                              <span className="text-[9px] text-slate-500 block mt-1">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {!note.isRead && (
                              <button 
                                onClick={() => markNotificationRead(note.id)}
                                className="text-[10px] text-slate-400 hover:text-white font-bold font-heading"
                              >
                                Dismiss
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {activeTab === 'profile' && <ProfileEdit />}

        {activeTab === 'settings' && (
          <div className="glass-panel bg-slate-950/45 border border-white/[0.08] p-6 rounded-2xl max-w-xl animate-fade-in">
            <h2 className="font-heading text-3xl font-bold text-saffron border-b border-white/[0.06] pb-3 mb-4">Portal Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/40 rounded-xl border border-white/[0.06] font-body">
                <h4 className="font-bold mb-1 text-slate-200">Developer Mode Toggles</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">All services (PostgreSQL Database, local Mock Redis, SMTP Mail server, File Upload mock) are currently running dynamically.</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">DB LOCAL</span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">REDIS MEMCACHE</span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">SMTP CONSOLE</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* SUBMISSION MODAL */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#020308]/80 backdrop-blur-md" onClick={() => setIsApplyModalOpen(false)} />
          <div className="relative glass-panel w-full max-w-md mx-4 p-8 rounded-2xl bg-slate-950 border border-white/[0.08] shadow-2xl z-10 font-body">
            <button 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsApplyModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-heading text-2xl font-bold text-saffron mb-2">New Examination Admission</h3>
            <p className="text-slate-400 text-xs mb-6">Select a testing board. Your profile details will be submitted to the commission securely.</p>

            {feedback.error && (
              <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                {feedback.error}
              </div>
            )}
            {feedback.success && (
              <div className="p-3 mb-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                {feedback.success}
              </div>
            )}

            {(() => {
              const selectedExam = exams.find(e => e.id === selectedExamId);
              
              const applyLinks = {
                NEET: 'https://neet.nta.nic.in/',
                JEE: 'https://jeemain.nta.nic.in/',
                UGC_NET: 'https://ugcnet.nta.nic.in/',
                SLET: 'https://sletne.org/',
                SSC: 'https://ssc.gov.in/',
                APSC: 'https://apsc.nic.in/cce.html#cce_pre'
              };

              const selectedLink = selectedExam ? (applyLinks[selectedExam.code] || '#') : '';
              const needsGraduation = selectedExam && ['UGC_NET', 'SLET', 'APSC'].includes(selectedExam.code);
              
              const isProfileIncomplete = !profile?.fullName || !profile?.phone || !profile?.address || !profile?.board || !profile?.highSchoolMarks || !profile?.higherSecondaryMarks || !profile?.photoUrl || !profile?.signatureUrl;
              
              const hasGraduationError = needsGraduation && !profile?.graduationMarks;
              const hasError = isProfileIncomplete || hasGraduationError;

              return (
                <form onSubmit={(ev) => {
                  ev.preventDefault();
                  if (selectedLink) {
                    window.open(selectedLink, '_blank');
                  }
                  handleApplySubmit(ev);
                }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Active Exam</label>
                    <select 
                      className="w-full bg-slate-950 border border-white/[0.08] hover:border-white/[0.15] rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all duration-300"
                      value={selectedExamId}
                      onChange={e => setSelectedExamId(e.target.value)}
                    >
                      <option value="" className="bg-slate-950 text-slate-100">-- Choose Exam --</option>
                      {exams.map(e => (
                        <option key={e.id} value={e.id} className="bg-slate-950 text-slate-100">
                          {e.code} - {e.name} (₹{e.applicationFee})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedExamId && selectedLink && (
                    <div className="p-3.5 bg-saffron/5 border border-saffron/20 rounded-xl text-saffron text-xs leading-relaxed font-body">
                      🌐 <strong>Main Office Site:</strong> <a href={selectedLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-400">{selectedLink}</a>
                      <p className="mt-1.5 text-slate-400 font-normal">Clicking apply will open this official page to complete your form, and register the application on our dashboard as <strong className="text-emerald-400">Applied</strong>.</p>
                    </div>
                  )}

                  {selectedExamId && (
                    <div className="space-y-2">
                      {isProfileIncomplete && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
                          ⚠️ Profile incomplete! Please fill Name, Phone, Address, Class 10 & 12 details, Photo, and Signature in the "Universal Profile" tab first.
                        </div>
                      )}
                      {hasGraduationError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
                          ⚠️ Graduation Marks required! Applying for {selectedExam.code} requires graduation details. Update your profile tab first.
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={applicationsLoading || (selectedExamId && hasError)}
                    className="w-full bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-heading font-bold text-lg py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-saffron/20 hover:shadow-saffron/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applicationsLoading ? 'Registering Application...' : 'Apply on Official Site & Mark Applied'}
                  </button>
                </form>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
