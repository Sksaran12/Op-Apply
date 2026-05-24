// Simple cache module representing Redis with an in-memory fallback
const memoryCache = new Map();

const redisClient = {
  get: async (key) => {
    const data = memoryCache.get(key);
    if (!data) return null;
    if (data.expiry && Date.now() > data.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return data.value;
  },
  set: async (key, value, mode, duration) => {
    let expiry = null;
    if (mode === 'EX' && duration) {
      expiry = Date.now() + duration * 1000;
    }
    memoryCache.set(key, { value, expiry });
    return 'OK';
  },
  del: async (key) => {
    return memoryCache.delete(key) ? 1 : 0;
  },
  flushAll: async () => {
    memoryCache.clear();
    return 'OK';
  }
};

console.log('Cache initialized in-memory (fallback mode enabled)');

export default redisClient;
