import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // --- AUTH STATE ---
  user: null,
  isAuthenticated: false,
  authLoading: true,
  authError: null,



  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      set({ user: data.user, isAuthenticated: true, authLoading: false });
      return { success: true };
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return { success: false, message: err.message };
    }
  },

  register: async (email, password, fullName) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      set({ authLoading: false });
      return { success: true, message: data.message };
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return { success: false, message: err.message };
    }
  },

  googleLogin: async (email, name, googleId) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/google-oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, googleId })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Google Login failed');

      set({ user: data.user, isAuthenticated: true, authLoading: false });
      return { success: true };
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return { success: false, message: err.message };
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout request failed', e);
    }
    set({ user: null, isAuthenticated: false, profile: null, applications: [], notifications: [] });
  },

  checkSession: async () => {
    set({ authLoading: true });
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const profile = await res.json();
        // Set basic user info if profile retrieved successfully
        set({
          user: { id: profile.userId, email: '', fullName: profile.fullName, isVerified: true },
          profile,
          isAuthenticated: true,
          authLoading: false
        });
      } else {
        // Try refresh token
        const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
        if (refreshRes.ok) {
          const profileRes = await fetch('/api/profile');
          if (profileRes.ok) {
            const profile = await profileRes.json();
            set({
              user: { id: profile.userId, email: '', fullName: profile.fullName, isVerified: true },
              profile,
              isAuthenticated: true,
              authLoading: false
            });
            return;
          }
        }
        set({ user: null, isAuthenticated: false, authLoading: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, authLoading: false });
    }
  },

  // --- PROFILE STATE ---
  profile: null,
  profileLoading: false,

  fetchProfile: async () => {
    set({ profileLoading: true });
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ profile: data, profileLoading: false });
    } catch (err) {
      console.error(err);
      set({ profileLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ profileLoading: true });
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ profile: data.profile, profileLoading: false });
      return { success: true };
    } catch (err) {
      set({ profileLoading: false });
      return { success: false, message: err.message };
    }
  },

  // --- EXAMS STATE ---
  exams: [],
  examsLoading: false,

  fetchExams: async () => {
    set({ examsLoading: true });
    try {
      const res = await fetch('/api/exams');
      const data = await res.json();
      set({ exams: data, examsLoading: false });
    } catch (err) {
      console.error('Error fetching exams', err);
      set({ examsLoading: false });
    }
  },

  // --- APPLICATIONS STATE ---
  applications: [],
  applicationsLoading: false,

  fetchApplications: async () => {
    set({ applicationsLoading: true });
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      set({ applications: data, applicationsLoading: false });
    } catch (err) {
      console.error('Error fetching applications', err);
      set({ applicationsLoading: false });
    }
  },

  submitApplication: async (examId) => {
    set({ applicationsLoading: true });
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Submission failed');

      // Refresh applications list
      await get().fetchApplications();
      // Refresh notifications
      await get().fetchNotifications();
      
      set({ applicationsLoading: false });
      return { success: true, message: data.message };
    } catch (err) {
      set({ applicationsLoading: false });
      return { success: false, message: err.message };
    }
  },

  // --- NOTIFICATIONS STATE ---
  notifications: [],
  notificationsLoading: false,

  fetchNotifications: async () => {
    set({ notificationsLoading: true });
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      set({ notifications: data, notificationsLoading: false });
    } catch (err) {
      console.error('Error fetching notifications', err);
      set({ notificationsLoading: false });
    }
  },

  markNotificationRead: async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      if (res.ok) {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          )
        }));
      }
    } catch (err) {
      console.error('Error marking notification read', err);
    }
  }
}));
