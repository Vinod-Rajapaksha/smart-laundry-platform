import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  hasPermission: boolean;
  isTracking: boolean;
  startTracking: (onLocationUpdate: (lat: number, lng: number) => void) => void;
  stopTracking: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbackRef = useRef<((lat: number, lng: number) => void) | null>(null);

  useEffect(() => {
    requestPermission();
    return () => {
      stopTracking();
    };
  }, []);

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      };
    } catch {
      return null;
    }
  };

  const startTracking = (onLocationUpdate: (lat: number, lng: number) => void) => {
    if (!hasPermission) return;

    callbackRef.current = onLocationUpdate;
    setIsTracking(true);

    // Send location immediately
    getCurrentLocation().then((loc) => {
      if (loc) {
        setLocation(loc);
        onLocationUpdate(loc.latitude, loc.longitude);
      }
    });

    // Then send every 10 seconds
    intervalRef.current = setInterval(async () => {
      const loc = await getCurrentLocation();
      if (loc && callbackRef.current) {
        setLocation(loc);
        callbackRef.current(loc.latitude, loc.longitude);
      }
    }, 10000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
    callbackRef.current = null;
  };

  return {
    location,
    hasPermission,
    isTracking,
    startTracking,
    stopTracking,
  };
};