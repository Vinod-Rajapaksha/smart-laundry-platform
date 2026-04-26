import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'osm_cache_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

interface CacheEntry {
  data: any;
  timestamp: number;
}

export const mapCache = {
  async set(key: string, data: any): Promise<void> {
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('MapCache set error:', error);
    }
  },

  async get(key: string): Promise<any | null> {
    try {
      const stored = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!stored) return null;

      const entry: CacheEntry = JSON.parse(stored);
      const isExpired = Date.now() - entry.timestamp > CACHE_EXPIRY;

      if (isExpired) {
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('MapCache get error:', error);
      return null;
    }
  },

  getCoordKey(lat: number, lng: number): string {
    return `coord_${lat.toFixed(4)}_${lng.toFixed(4)}`;
  },

  getRouteKey(startLat: number, startLng: number, endLat: number, endLng: number): string {
    return `route_${startLat.toFixed(3)}_${startLng.toFixed(3)}_${endLat.toFixed(3)}_${endLng.toFixed(3)}`;
  }
};
