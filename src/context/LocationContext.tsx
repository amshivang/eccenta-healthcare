"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useGeolocation, LocationState } from "@/hooks/useGeolocation";

interface LocationContextType {
  location: LocationState | null;
  address: string | null;
  error: string | null;
  loading: boolean;
  permissionGranted: boolean | null;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const geolocation = useGeolocation();

  return (
    <LocationContext.Provider value={geolocation}>
      {children}
    </LocationContext.Provider>
  );
}

export function useGlobalLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useGlobalLocation must be used within a LocationProvider");
  }
  return context;
}
