import { create } from 'zustand';

const safeParseJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('The server is currently waking up on Render. Please wait 10-15 seconds and try again.');
  }
};

const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('accessToken');
  return {
    ...extraHeaders,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const useAppStore = create((set, get) => ({
  // --- AUTH STATE ---
  user: null,
  isAuthenticated: false,
  authLoading: true,
  authError: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await safeParseJson(res);
      
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        set({ accessToken: data.accessToken });
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
        set({ refreshToken: data.refreshToken });
      }

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
      const data = await safeParseJson(res);

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
      const data = await safeParseJson(res);

      if (!res.ok) throw new Error(data.message || 'Google Login failed');

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        set({ accessToken: data.accessToken });
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
        set({ refreshToken: data.refreshToken });
      }

      set({ user: data.user, isAuthenticated: true, authLoading: false });
      return { success: true };
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return { success: false, message: err.message };
    }
  },

  logout: async () => {
    try {
      const headers = getAuthHeaders();
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers
      });
    } catch (e) {
      console.error('Logout request failed', e);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ 
      user: null, 
      isAuthenticated: false, 
      profile: null, 
      applications: [], 
      notifications: [],
      accessToken: null,
      refreshToken: null
    });
  },

  checkSession: async () => {
    set({ authLoading: true });
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/profile', { headers });
      if (res.ok) {
        const profile = await safeParseJson(res);
        set({
          user: { id: profile.userId, email: '', fullName: profile.fullName, isVerified: true },
          profile,
          isAuthenticated: true,
          authLoading: false
        });
      } else {
        // Try refresh token using request body
        const rt = localStorage.getItem('refreshToken');
        if (rt) {
          const refreshRes = await fetch('/api/auth/refresh', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: rt })
          });
          if (refreshRes.ok) {
            const refreshData = await safeParseJson(refreshRes);
            if (refreshData.accessToken) {
              localStorage.setItem('accessToken', refreshData.accessToken);
              set({ accessToken: refreshData.accessToken });
              
              const profileRes = await fetch('/api/profile', { 
                headers: getAuthHeaders() 
              });
              if (profileRes.ok) {
                const profile = await safeParseJson(profileRes);
                set({
                  user: { id: profile.userId, email: '', fullName: profile.fullName, isVerified: true },
                  profile,
                  isAuthenticated: true,
                  authLoading: false
                });
                return;
              }
            }
          }
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false, authLoading: false, accessToken: null, refreshToken: null });
      }
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false, authLoading: false, accessToken: null, refreshToken: null });
    }
  },

  // --- PROFILE STATE ---
  profile: null,
  profileLoading: false,

  fetchProfile: async () => {
    set({ profileLoading: true });
    try {
      const res = await fetch('/api/profile', { headers: getAuthHeaders() });
      const data = await safeParseJson(res);
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
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(profileData)
      });
      const data = await safeParseJson(res);
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
      const res = await fetch('/api/exams', { headers: getAuthHeaders() });
      const data = await safeParseJson(res);
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
      const res = await fetch('/api/applications', { headers: getAuthHeaders() });
      const data = await safeParseJson(res);
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
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ examId })
      });
      const data = await safeParseJson(res);

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

  deleteApplication: async (appId) => {
    set({ applicationsLoading: true });
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await safeParseJson(res);

      if (!res.ok) throw new Error(data.message || 'Failed to remove application');

      // Refresh applications list
      await get().fetchApplications();
      
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
      const res = await fetch('/api/notifications', { headers: getAuthHeaders() });
      const data = await safeParseJson(res);
      set({ notifications: data, notificationsLoading: false });
    } catch (err) {
      console.error('Error fetching notifications', err);
      set({ notificationsLoading: false });
    }
  },

  markNotificationRead: async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        set(state => ({
          notifications: state.notifications.map(n =>
            n._id === id ? { ...n, isRead: true } : n
          )
        }));
      }
    } catch (err) {
      console.error('Error marking notification read', err);
    }
  }
}));
