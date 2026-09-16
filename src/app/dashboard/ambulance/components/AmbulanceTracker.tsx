"use client";

import { useEffect, useRef, useState } from "react";

interface AmbulanceTrackerProps {
  pickupLat?: number;
  pickupLng?: number;
  etaMinutes?: number;
}

export default function AmbulanceTracker({ pickupLat = 28.6139, pickupLng = 77.2090, etaMinutes = 10 }: AmbulanceTrackerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isInvalidKey = !apiKey || apiKey === "your_google_maps_api_key_here" || apiKey.includes("YOUR_API_KEY");
  const [mapError, setMapError] = useState(isInvalidKey);
  const [isLoaded, setIsLoaded] = useState(false);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (isInvalidKey) return;

    let cleanupTimer: (() => void) | undefined;

    const initMap = () => {
      if (!mapRef.current || !(window as any).google) return;

      const google = (window as any).google;
      const center = { lat: pickupLat, lng: pickupLng };

      // Simulate ambulance starting from a slightly different location
      const startLocation = {
        lat: pickupLat + 0.02,
        lng: pickupLng + 0.02
      };

      const map = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: 13,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
      });

      // Patient/Pickup Marker
      new google.maps.Marker({
        position: center,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#ef4444", // red-500
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: "Pickup Location"
      });

      // Ambulance Marker
      const ambulanceMarker = new google.maps.Marker({
        position: startLocation,
        map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"></path><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path><path d="M14 17h1"></path><circle cx="7.5" cy="17.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle><rect x="6" y="8" width="4" height="4"></rect></svg>'),
          scaledSize: new google.maps.Size(40, 40)
        },
        title: "Ambulance"
      });
      
      markerRef.current = ambulanceMarker;

      // Simulate movement
      const steps = 60; // 60 steps to reach
      let currentStep = 0;
      
      const latStep = (center.lat - startLocation.lat) / steps;
      const lngStep = (center.lng - startLocation.lng) / steps;

      const interval = setInterval(() => {
        if (currentStep >= steps) {
          clearInterval(interval);
          return;
        }
        
        currentStep++;
        const newPos = {
          lat: startLocation.lat + (latStep * currentStep),
          lng: startLocation.lng + (lngStep * currentStep)
        };
        
        ambulanceMarker.setPosition(newPos);
      }, 1000); // Move every second for simulation

      cleanupTimer = () => clearInterval(interval);
    };

    if ((window as any).google && (window as any).google.maps) {
      initMap();
      return () => {
        if (cleanupTimer) cleanupTimer();
      };
    }

    const existingScript = document.getElementById("googleMapsScript");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.id = "googleMapsScript";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        initMap();
      };
      script.onerror = () => setMapError(true);
      document.head.appendChild(script);
    } else if (isLoaded) {
      initMap();
    }

    return () => {
      if (cleanupTimer) cleanupTimer();
    };
  }, [pickupLat, pickupLng, isLoaded, isInvalidKey, apiKey]);

  if (mapError) {
    return (
      <div className="w-full h-[300px] bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center justify-center p-6 text-center mt-4">
        <h3 className="font-bold text-red-900 mb-2">Live Tracking Unavailable</h3>
        <p className="text-sm text-red-500 max-w-sm">Please add your Google Maps API key to your environment variables to enable live tracking.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-red-100">Live Ambulance Location</span>
        <span className="flex items-center gap-1 text-xs text-red-600 bg-white px-2 py-1 rounded-full font-bold">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Live
        </span>
      </div>
      <div ref={mapRef} className="w-full h-[300px] rounded-2xl border border-red-200/30 overflow-hidden shadow-inner" />
    </div>
  );
}
