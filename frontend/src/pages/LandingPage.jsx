import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroParticles from '../components/HeroParticles';
import { useAppStore } from '../store/store';

export default function LandingPage({ onOpenAuth, onApplyExam }) {
  const { isAuthenticated } = useAppStore();
  const [selectedExploreExam, setSelectedExploreExam] = useState(null);
  // Count up stats
  const [appsCount, setAppsCount] = useState(0);
  const [examsCount, setExamsCount] = useState(0);

  useEffect(() => {
    // Count up 0 -> 1.8M
    let currentApps = 0;
    const targetApps = 1842095;
    const appStep = Math.ceil(targetApps / 60);
    const appTimer = setInterval(() => {
      currentApps += appStep;
      if (currentApps >= targetApps) {
        setAppsCount(targetApps);
        clearInterval(appTimer);
      } else {
        setAppsCount(currentApps);
      }
    }, 25);

    // Count up 0 -> 12
    let currentExams = 0;
    const targetExams = 12;
    const examTimer = setInterval(() => {
      currentExams += 1;
      if (currentExams >= targetExams) {
        setExamsCount(targetExams);
        clearInterval(examTimer);
      } else {
        setExamsCount(currentExams);
      }
    }, 100);

    return () => {
      clearInterval(appTimer);
      clearInterval(examTimer);
    };
  }, []);

  const exams = [
    { code: 'NEET', name: 'NEET UG', type: 'Medical Sciences', desc: 'National Eligibility cum Entrance Test for undergraduate medical courses.', glow: 'glow-NEET', color: '#ef4444', applyLink: 'https://neet.nta.nic.in/' },
    { code: 'JEE', name: 'JEE Main', type: 'Engineering & Tech', desc: 'Joint Entrance Examination for admission to premier technical institutes.', glow: 'glow-JEE', color: '#0ea5e9',   applyLink: 'https://jeemain.nta.nic.in/' },
    { code: 'UGC_NET', name: 'UGC NET', type: 'Doctoral & Professorship', desc: 'University Grants Commission National Eligibility Test for JRF & lectureship.', glow: 'glow-UGC_NET', color: '#6366f1', applyLink: 'https://ugcnet.nta.nic.in/' },
    { code: 'SLET', name: 'SLET Commission', type: 'State Level Academics', desc: 'State Level Eligibility Test for recruitment of lecturers within Indian states.', glow: 'glow-SLET', color: '#10b981', applyLink: 'https://sletne.org/' },
    { code: 'SSC', name: 'SSC CGL', type: 'Central Government', desc: 'Staff Selection Commission Combined Graduate Level recruitments.', glow: 'glow-SSC', color: '#eab308', applyLink: 'https://ssc.gov.in/' },
    { code: 'APSC', name: 'APSC CCE', type: 'Civil Services', desc: 'Assam Public Service Commission recruitment for state administrative cadres.', glow: 'glow-APSC', color: '#a855f7', applyLink: 'https://apsc.nic.in/cce.html#cce_pre' }
  ];

  const features = [
    { title: 'Gmail Alerts', desc: 'Instant push notifications dispatched to your inbox for registration, approvals, and reminders.', icon: 'mail', border: 'border-l-saffron' },
    { title: 'REST API Sync', desc: 'Advanced API integration points for testing boards, security agencies, and state commissions.', icon: 'api', border: 'border-l-exam-jee' },
    { title: 'Unified Dashboard', desc: 'Command center access to track active applications, retrieve admit cards, and review timelines.', icon: 'dashboard_customize', border: 'border-l-indiagreen' },
    { title: 'Universal Profile', desc: 'One-time encrypted demographic profile saving hours of repeated document entry.', icon: 'badge', border: 'border-l-exam-slet' },
    { title: 'Deadline Tracker', desc: 'Intelligent visual countdowns sending email warnings three days before submission closure.', icon: 'timer', border: 'border-l-exam-neet' },
    { title: 'Document Vault', desc: 'Secure AES-256 cloud repository keeping academic certificates ready for instant uploads.', icon: 'cloud_done', border: 'border-l-exam-apsc' }
  ];

  return (
    <div className="relative min-h-screen bg-[#04060E] text-slate-100 overflow-x-hidden">
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-saffron/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-100px] w-[600px] h-[600px] bg-[#10b981]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-100px] left-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="grid-overlay absolute inset-0 z-0 opacity-20 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24 px-6 md:px-12 z-10">
        <HeroParticles />
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Hero Headers */}
          <div className="space-y-6">
            <motion.h1 
              className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              One Portal.<br />Every Exam.<br />
              <span className="bg-gradient-to-r from-saffron to-amber-500 bg-clip-text text-transparent">Your Future.</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-slate-300 max-w-lg font-light leading-relaxed font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Streamline your academic career with India's unified gateway. Submit profiles, submit applications, and retrieve hall tickets for national and regional examinations from a high-tech center.
            </motion.p>

            <motion.div 
              className="flex flex-wrap items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <button 
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy px-10 py-4 font-heading font-bold text-xl rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-saffron/25 hover:shadow-saffron/45 hover:-translate-y-0.5 animate-pulse-saffron"
              >
                Get Started
              </button>

              <div className="flex gap-8 border-l border-white/[0.08] pl-8 font-heading">
                <div>
                  <div className="text-4xl font-extrabold text-white leading-none">{(appsCount / 1000000).toFixed(1)}M+</div>
                  <span className="text-xs text-slate-400 mt-1 block">Applications</span>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-white leading-none">{examsCount}+</div>
                  <span className="text-xs text-slate-400 mt-1 block">Linked Boards</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Status Card Mockup */}
          <motion.div 
            className="block relative w-full max-w-md mx-auto lg:max-w-none mt-12 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/[0.08] relative z-10 animate-float shadow-2xl bg-slate-950/45">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-bold font-heading">Unified Tracking System</h3>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>

              <div className="space-y-4 font-body">
                <div className="p-4 bg-slate-950/40 rounded-xl border border-white/[0.05]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-200">JEE Main 2026</span>
                    <span className="text-xs font-bold text-emerald-400">APPROVED</span>
                  </div>
                  <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-full" />
                  </div>
                </div>

                <div className="p-4 bg-slate-950/40 rounded-xl border border-white/[0.05]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-200">NEET UG 2026</span>
                    <span className="text-xs font-bold text-saffron">UNDER REVIEW</span>
                  </div>
                  <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-saffron to-amber-500 h-full w-[70%]" />
                  </div>
                </div>

                <div className="p-4 bg-slate-950/40 rounded-xl border border-white/[0.05]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-200">UGC NET 2026</span>
                    <span className="text-xs font-bold text-slate-400">DOCUMENT VAULT</span>
                  </div>
                  <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white/20 h-full w-[45%]" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tech accents */}
            <div className="hidden sm:block absolute -top-8 -right-8 w-24 h-24 border-t-2 border-r-2 border-saffron/20 rounded-tr-2xl" />
            <div className="hidden sm:block absolute -bottom-8 -left-8 w-24 h-24 border-b-2 border-l-2 border-white/5 rounded-bl-2xl" />
          </motion.div>
        </div>
      </section>

      {/* EXAMS SECTION */}
      <section id="exams" className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Available Exams</h2>
          <p className="text-slate-400 max-w-lg mx-auto font-medium font-body">Click apply to initiate your single-profile application flow for major competitive examinations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div 
              key={exam.code}
              className={`glass-panel bg-slate-950/40 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${exam.glow}`}
              onClick={() => setSelectedExploreExam(exam)}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span 
                    className="material-symbols-outlined text-4xl" 
                    style={{ color: exam.color }}
                  >
                    {exam.code === 'NEET' ? 'medical_services' : exam.code === 'JEE' ? 'engineering' : exam.code === 'UGC_NET' ? 'school' : exam.code === 'SLET' ? 'workspace_premium' : exam.code === 'SSC' ? 'account_balance' : 'public'}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">{exam.type}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold mb-2 text-white">{exam.name}</h3>
                <p className="text-sm text-slate-400 font-body leading-relaxed mb-6">{exam.desc}</p>
              </div>
              {isAuthenticated ? (
                <div className="flex gap-3">
                  <button 
                    className="flex-1 py-2.5 font-heading font-bold text-sm border border-white/[0.08] rounded-xl transition-all duration-300 hover:bg-white/[0.05] hover:text-white flex items-center justify-center gap-1"
                    onClick={(e) => { e.stopPropagation(); setSelectedExploreExam(exam); }}
                  >
                    Explore
                  </button>
                  <button 
                    className="flex-1 py-2.5 font-heading font-bold text-sm bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1"
                    onClick={(e) => { e.stopPropagation(); onApplyExam(exam.code); }}
                  >
                    Apply Now
                  </button>
                </div>
              ) : (
                <button 
                  className="w-full py-3 font-heading font-bold text-base border border-white/[0.08] rounded-xl transition-all duration-300 hover:text-white hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                  onClick={(e) => { e.stopPropagation(); setSelectedExploreExam(exam); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = exam.color;
                    e.currentTarget.style.borderColor = exam.color;
                    e.currentTarget.style.boxShadow = `0 0 15px ${exam.color}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Explore Details
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-950/40 border-y border-white/[0.04] px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Applicant Flow</h2>
            <p className="text-slate-400 font-medium font-body">Complete three simple steps to submit applications for any linked board.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-saffron/10 to-amber-500/10 rounded-full flex items-center justify-center mb-5 border border-saffron/30 group-hover:scale-105 group-hover:border-saffron/60 group-hover:shadow-[0_0_20px_rgba(255,153,51,0.15)] transition-all duration-300">
                <span className="material-symbols-outlined text-saffron text-4xl">person_add</span>
              </div>
              <h4 className="font-heading text-xl font-bold mb-2 text-white">1. Create Profile</h4>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed font-body">Enter demographic data and upload verification documents (photo/signature) to your vault.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-saffron/10 to-amber-500/10 rounded-full flex items-center justify-center mb-5 border border-saffron/30 group-hover:scale-105 group-hover:border-saffron/60 group-hover:shadow-[0_0_20px_rgba(255,153,51,0.15)] transition-all duration-300">
                <span className="material-symbols-outlined text-saffron text-4xl">search</span>
              </div>
              <h4 className="font-heading text-xl font-bold mb-2 text-white">2. Apply Instantly</h4>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed font-body">Select your desired entrance board, review application fees, and submit with one click.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-saffron/10 to-amber-500/10 rounded-full flex items-center justify-center mb-5 border border-saffron/30 group-hover:scale-105 group-hover:border-saffron/60 group-hover:shadow-[0_0_20px_rgba(255,153,51,0.15)] transition-all duration-300">
                <span className="material-symbols-outlined text-saffron text-4xl">monitoring</span>
              </div>
              <h4 className="font-heading text-xl font-bold mb-2 text-white">3. Track & Download</h4>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed font-body">Receive instant updates, verify admit cards, and review declared results dynamically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12 text-center text-white">Built for Speed & Trust</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div key={feat.title} className={`glass-panel bg-slate-950/40 p-8 rounded-2xl border-l-4 ${feat.border} flex flex-col justify-between hover:border-l-saffron transition-all duration-300`}>
              <div>
                <span className="material-symbols-outlined text-3xl text-saffron mb-4 block">{feat.icon}</span>
                <h4 className="font-heading text-xl font-bold mb-2 text-white">{feat.title}</h4>
                <p className="text-sm text-slate-400 font-body leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="bg-gradient-to-r from-slate-950 via-[#0B0F19] to-saffron/[0.04] border border-white/[0.08] rounded-3xl p-12 relative overflow-hidden text-center shadow-2xl">
          <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-white">Ready to secure your future?</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8 font-medium font-body">Join over 1 million Indian candidates using OP.Apply to simplify their higher education admissions.</p>
            <button 
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-heading font-bold text-xl px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:-translate-y-0.5"
            >
              Register Account Now
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER - obsidian themed */}
      <footer className="bg-[#020308] border-t border-white/[0.05] py-16 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 font-body">
          <div>
            <div className="font-heading text-2xl font-bold text-saffron mb-4">OP.Apply</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official unified examination applicant portal for India's national testing agencies. Built for accessibility, efficiency, and reliability.
            </p>
          </div>
          <div>
            <h5 className="text-white font-heading font-bold text-lg mb-4">Exam Catalogs</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-saffron transition-colors">NEET Medical</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">JEE Engineering</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">UGC NET Fellowship</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">APSC Civil Services</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-heading font-bold text-lg mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-saffron transition-colors">Candidate FAQs</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">Support Desk</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-heading font-bold text-lg mb-4">Official Verification</h5>
            <div className="inline-block bg-saffron/5 border border-saffron/20 rounded-xl px-4 py-3 text-left">
              <span className="text-[10px] font-bold text-saffron uppercase tracking-widest font-heading">GOVT OF INDIA PORTAL</span>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">National Testing Agency, Ministry of Education</p>
            </div>
          </div>
        </div>
      </footer>

      {/* EXAM EXPLORER MODAL */}
      {selectedExploreExam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-[#020308]/85 backdrop-blur-md" onClick={() => setSelectedExploreExam(null)} />
          <div className="relative glass-panel w-full max-w-lg mx-4 p-8 rounded-2xl bg-slate-950 border border-white/[0.08] shadow-2xl z-10 font-body max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              onClick={() => setSelectedExploreExam(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <span 
                className="material-symbols-outlined text-4xl" 
                style={{ color: selectedExploreExam.color }}
              >
                {selectedExploreExam.code === 'NEET' ? 'medical_services' : selectedExploreExam.code === 'JEE' ? 'engineering' : selectedExploreExam.code === 'UGC_NET' ? 'school' : selectedExploreExam.code === 'SLET' ? 'workspace_premium' : selectedExploreExam.code === 'SSC' ? 'account_balance' : 'public'}
              </span>
              <div>
                <h3 className="font-heading text-2xl font-bold text-white leading-tight">{selectedExploreExam.name}</h3>
                <span className="text-[10px] font-bold tracking-wider text-saffron uppercase bg-saffron/10 px-2 py-0.5 rounded border border-saffron/20 mt-1.5 inline-block">{selectedExploreExam.type}</span>
              </div>
            </div>

            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div>
                <h4 className="text-white font-heading font-semibold text-base mb-1">Description</h4>
                <p className="text-slate-400 font-light leading-relaxed">{selectedExploreExam.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Application Fee</span>
                  <p className="text-white font-bold text-lg font-heading mt-0.5">
                    {selectedExploreExam.code === 'NEET' ? '₹1,700' : selectedExploreExam.code === 'JEE' ? '₹1,000' : selectedExploreExam.code === 'UGC_NET' ? '₹1,150' : selectedExploreExam.code === 'SLET' ? '₹1,200' : selectedExploreExam.code === 'SSC' ? '₹100' : '₹297'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Minimum Eligibility</span>
                  <p className="text-white font-semibold mt-0.5">
                    {selectedExploreExam.code === 'NEET' ? '12th Pass (PCB)' : selectedExploreExam.code === 'JEE' ? '12th Pass (PCM)' : selectedExploreExam.code === 'UGC_NET' ? 'Master\'s Degree' : selectedExploreExam.code === 'SLET' ? 'Master\'s Degree' : selectedExploreExam.code === 'SSC' ? 'Graduate Degree' : 'Graduate Degree'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-heading font-semibold text-base mb-2">Instructions & Guidelines</h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400 font-light pl-1">
                  <li>Complete demographic entries in your universal profile first.</li>
                  <li>Upload a high-resolution photograph and signatures under 2MB.</li>
                  <li>Review application details before making final submissions.</li>
                  <li>Admit cards will be generated instantly upon approval.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-heading font-semibold text-base mb-1">Official Commission Website</h4>
                <a 
                  href={selectedExploreExam.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-saffron hover:underline flex items-center gap-1 font-semibold text-sm"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  {selectedExploreExam.applyLink}
                </a>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setSelectedExploreExam(null);
                      onApplyExam(selectedExploreExam.code);
                    }}
                    className="w-full bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-heading font-bold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-lg shadow-saffron/20"
                  >
                    Go to Dashboard & Apply Now
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 font-heading font-bold">
                    <div className="text-center p-3.5 bg-saffron/5 border border-saffron/20 rounded-xl text-saffron  text-xs leading-relaxed font-body font-normal">
                      🔒 Please log in or create an account to register and submit applications for this examination.
                    </div>
                    <button
                      onClick={() => {
                        setSelectedExploreExam(null);
                        onOpenAuth();
                      }}
                      className="w-full bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-heading font-bold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-lg shadow-saffron/20 text-center block"
                    >
                      Login & Apply Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
