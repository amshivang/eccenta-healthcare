import { useState, useEffect, useCallback } from 'react';

export interface LocationState {
  lat: number;
  lng: number;
}

const DEFAULT_LOCATION: LocationState = { lat: 26.8467, lng: 80.9462 }; // Lucknow fallback
const DEFAULT_ADDRESS = "Lucknow, Uttar Pradesh";

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState | null>(() => {
    if (typeof window !== "undefined" && !("geolocation" in navigator)) {
      return DEFAULT_LOCATION;
    }
    return null;
  });
  const [address, setAddress] = useState<string | null>(() => {
    if (typeof window !== "undefined" && !("geolocation" in navigator)) {
      return DEFAULT_ADDRESS;
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(() => {
    if (typeof window !== "undefined" && !("geolocation" in navigator)) {
      return false;
    }
    return null;
  });

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { "User-Agent": "EccenTa-Healthcare-App" },
      });
      const data = await res.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(", ");
        return parts.slice(0, 3).join(", ");
      }
    } catch (e) {
      console.error("Reverse geocoding failed", e);
    }
    return DEFAULT_ADDRESS;
  };

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocation(DEFAULT_LOCATION);
      setAddress(DEFAULT_ADDRESS);
      setPermissionGranted(false);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);
        setPermissionGranted(true);
        const resolvedAddress = await fetchAddress(coords.lat, coords.lng);
        setAddress(resolvedAddress);
        setLoading(false);
      },
      () => {
        setLocation(DEFAULT_LOCATION);
        setAddress(DEFAULT_ADDRESS);
        setPermissionGranted(false);
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    let ignore = false;
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (ignore) return;
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);
        setPermissionGranted(true);
        const resolvedAddress = await fetchAddress(coords.lat, coords.lng);
        if (!ignore) setAddress(resolvedAddress);
      },
      () => {
        if (ignore) return;
        setLocation(DEFAULT_LOCATION);
        setAddress(DEFAULT_ADDRESS);
        setPermissionGranted(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );

    return () => {
      ignore = true;
    };
  }, []);

  return { location, address, error, loading, permissionGranted, requestLocation };
}
