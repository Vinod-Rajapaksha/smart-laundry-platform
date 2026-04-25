import { mapCache } from '../../utils/mapCache';

const HEADERS = {
  'User-Agent': 'SmartLaundryPlatformApp/1.0',
  'Accept': 'application/json',
};

export interface OSMPlace {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: any;
}

export const osmService = {
  async searchPlaces(query: string): Promise<OSMPlace[]> {
    if (!query || query.trim().length < 3) return [];

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;

    try {
      const response = await fetch(url, { headers: HEADERS });
      if (!response.ok) throw new Error('Nominatim search failed');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OSM Search Error:', error);
      return [];
    }
  },

  async reverseGeocode(lat: number, lon: number): Promise<string> {
    const cacheKey = mapCache.getCoordKey(lat, lon);
    const cachedAddress = await mapCache.get(cacheKey);
    if (cachedAddress) return cachedAddress;

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
      const response = await fetch(url, { headers: HEADERS });
      if (!response.ok) throw new Error('Nominatim reverse geocode failed');

      const data = await response.json();
      const address = data.display_name || 'Unknown Location';

      await mapCache.set(cacheKey, address);
      return address;
    } catch (error) {
      console.error('OSM Reverse Geocode Error:', error);
      return 'Unknown Location';
    }
  },

  async getDirections(startLat: number, startLng: number, endLat: number, endLng: number): Promise<string | null> {
    const cacheKey = mapCache.getRouteKey(startLat, startLng, endLat, endLng);
    const cachedPolyline = await mapCache.get(cacheKey);
    if (cachedPolyline) return cachedPolyline;

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=polyline`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('OSRM directions failed');

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const polyline = data.routes[0].geometry;
        await mapCache.set(cacheKey, polyline);
        return polyline;
      }
      return null;
    } catch (error) {
      console.error('OSRM Directions Error:', error);
      return null;
    }
  }
};
