import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/store';

export default function ProfileEdit() {
  const { profile, updateProfile, fetchProfile } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [category, setCategory] = useState('General');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [highSchoolMarks, setHighSchoolMarks] = useState(0);
  const [higherSecondaryMarks, setHigherSecondaryMarks] = useState(0);
  const [board, setBoard] = useState('');
  const [graduationMarks, setGraduationMarks] = useState('');

  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [signatureDataUrl, setSignatureDataUrl] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      if (profile.dateOfBirth) {
        setDateOfBirth(new Date(profile.dateOfBirth).toISOString().split('T')[0]);
      }
      setGender(profile.gender || 'Male');
      setCategory(profile.category || 'General');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setHighSchoolMarks(profile.highSchoolMarks || 0);
      setHigherSecondaryMarks(profile.higherSecondaryMarks || 0);
      setBoard(profile.board || '');
      setGraduationMarks(profile.graduationMarks || '');
    }
  }, [profile]);

  const handleFileConvert = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (target === 'photo') {
        setPhotoDataUrl(reader.result);
      } else {
        setSignatureDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const payload = {
      fullName,
      dateOfBirth,
      gender,
      category,
      phone,
      address,
      highSchoolMarks: parseFloat(highSchoolMarks),
      higherSecondaryMarks: parseFloat(higherSecondaryMarks),
      board,
      graduationMarks: graduationMarks ? parseFloat(graduationMarks) : null
    };

    if (photoDataUrl) payload.photoDataUrl = photoDataUrl;
    if (signatureDataUrl) payload.signatureDataUrl = signatureDataUrl;

    const res = await updateProfile(payload);
    if (res.success) {
      setSuccess('Profile updated successfully! Completion rating recalculated.');
      fetchProfile();
    } else {
      setError(res.message);
    }
    setSaving(false);
  };

  const inputClass = "w-full bg-slate-950/45 border border-white/[0.08] hover:border-white/[0.15] rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all duration-300";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="font-heading text-3xl font-bold text-saffron">Universal Student Profile</h2>
          <p className="text-slate-400 text-sm">Fill your credentials once. Use them to apply across multiple examinations.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold font-heading text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.15)]">
            {profile?.completionPercentage || 0}%
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Verification Index</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-heading text-xl text-slate-100 flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <span className="material-symbols-outlined text-saffron text-2xl">person</span>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name (As in certificates)</label>
              <input 
                type="text" 
                required
                className={inputClass}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
              <input 
                type="date" 
                required
                className={inputClass}
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
              <select 
                className={inputClass}
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="Male" className="bg-slate-900 text-slate-100">Male</option>
                <option value="Female" className="bg-slate-900 text-slate-100">Female</option>
                <option value="Other" className="bg-slate-900 text-slate-100">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category Group</label>
              <select 
                className={inputClass}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="General" className="bg-slate-900 text-slate-100">General</option>
                <option value="OBC" className="bg-slate-900 text-slate-100">OBC (Other Backward Classes)</option>
                <option value="SC" className="bg-slate-900 text-slate-100">SC (Scheduled Caste)</option>
                <option value="ST" className="bg-slate-900 text-slate-100">ST (Scheduled Tribe)</option>
                <option value="EWS" className="bg-slate-900 text-slate-100">EWS (Economically Weaker Section)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
              <input 
                type="tel" 
                required
                className={inputClass}
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Residential Address</label>
              <input 
                type="text" 
                required
                className={inputClass}
                placeholder="Village/City, State, PIN"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC DETAILS */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-heading text-xl text-slate-100 flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <span className="material-symbols-outlined text-saffron text-2xl">school</span>
            Academic Records
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">High School (Class 10) Marks (%)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="100"
                required
                className={inputClass}
                value={highSchoolMarks}
                onChange={e => setHighSchoolMarks(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Higher Secondary (Class 12) Marks (%)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="100"
                required
                className={inputClass}
                value={higherSecondaryMarks}
                onChange={e => setHigherSecondaryMarks(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Secondary Examination Board</label>
              <input 
                type="text" 
                required
                className={inputClass}
                placeholder="CBSE, ICSE, State Board"
                value={board}
                onChange={e => setBoard(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Graduation Marks (%, Optional)</label>
              <input 
                type="number" 
                step="0.01"
                className={inputClass}
                placeholder="Leave blank if applying for UG exams"
                value={graduationMarks}
                onChange={e => setGraduationMarks(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: UPLOADS */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-heading text-xl text-slate-100 flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <span className="material-symbols-outlined text-saffron text-2xl">cloud_upload</span>
            Required Document Uploads
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo upload */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate Photograph (Pass size, Max 2MB)</label>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-slate-950/60 border border-white/[0.08] rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                  {photoDataUrl || profile?.photoUrl ? (
                    <img 
                      src={photoDataUrl || profile?.photoUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover animate-fade-in"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-slate-600">image</span>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleFileConvert(e, 'photo')}
                  className="text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-saffron/10 file:to-amber-500/10 file:text-saffron file:font-heading file:font-bold file:cursor-pointer hover:file:bg-saffron/20 file:transition-all duration-300"
                />
              </div>
            </div>

            {/* Signature Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Applicant Signature (Clear page, Max 2MB)</label>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-slate-950/60 border border-white/[0.08] rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                  {signatureDataUrl || profile?.signatureUrl ? (
                    <img 
                      src={signatureDataUrl || profile?.signatureUrl} 
                      alt="Signature" 
                      className="w-full h-full object-contain p-1 animate-fade-in"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-slate-600">draw</span>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleFileConvert(e, 'signature')}
                  className="text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-saffron/10 file:to-amber-500/10 file:text-saffron file:font-heading file:font-bold file:cursor-pointer hover:file:bg-saffron/20 file:transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-heading font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-saffron/20 hover:shadow-saffron/40"
        >
          {saving ? 'Saving Profile...' : 'Save Profile Details'}
        </button>
      </form>
    </div>
  );
}
