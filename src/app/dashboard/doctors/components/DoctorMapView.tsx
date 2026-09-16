"use client";

import { useEffect, useRef, useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  rating: string;
  consultationFee: string;
  latitude?: string | null;
  longitude?: string | null;
}

interface DoctorMapViewProps {
  doctors: Doctor[];
  userLocation?: { lat: number; lng: number };
  center?: { lat: number; lng: number };
}

export default function DoctorMapView({ doctors, userLocation, center }: DoctorMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isInvalidKey = !apiKey || apiKey === "your_google_maps_api_key_here" || apiKey.includes("YOUR_API_KEY");
  const [mapError, setMapError] = useState(isInvalidKey);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isInvalidKey) return;

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center
      const mapCenter = center || userLocation || defaultCenter;

      const map = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: center || userLocation ? 12 : 5,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
      });

      if (userLocation) {
        new window.google.maps.Marker({
          position: userLocation,
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: "Your Location"
        });
      }

      const infoWindow = new window.google.maps.InfoWindow();

      doctors.forEach(doc => {
        if (doc.latitude && doc.longitude) {
          const marker = new window.google.maps.Marker({
            position: { lat: parseFloat(doc.latitude), lng: parseFloat(doc.longitude) },
            map,
            title: doc.name,
            icon: {
               url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#0891b2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'),
               scaledSize: new window.google.maps.Size(32, 32)
            }
          });

          marker.addListener("click", () => {
            const content = `
              <div style="padding: 8px; min-width: 200px; font-family: Inter, sans-serif;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 16px; color: #111827;">${doc.name}</h3>
                <p style="margin: 0 0 8px 0; color: #0891b2; font-weight: 500; font-size: 14px;">${doc.specialization}</p>
                <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 12px;">
                  <span style="background: #fef3c7; color: #b45309; padding: 2px 6px; border-radius: 999px; font-weight: bold;">★ ${doc.rating}</span>
                  <span style="background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 999px; font-weight: bold;">₹${doc.consultationFee}</span>
                </div>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((doc as any).clinicAddress || (doc as any).hospitalName ? `${doc.name}, ${(doc as any).clinicAddress || (doc as any).hospitalName}` : `${doc.latitude},${doc.longitude}`)}" target="_blank" style="display: block; width: 100%; text-align: center; background: #0891b2; color: white; padding: 8px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Navigate</a>
              </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          });
        }
      });
    };

    if ((window as any).google && (window as any).google.maps) {
      initMap();
      return;
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
  }, [doctors, userLocation, center, isLoaded, isInvalidKey, apiKey]);

  if (mapError) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center p-6 text-center shadow-inner">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 className="font-bold text-gray-900 mb-2">Map View Unavailable</h3>
        <p className="text-sm text-gray-500 max-w-sm">Please add your Google Maps API key to your environment variables to enable the interactive map view.</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-[400px] md:h-[500px] rounded-2xl border border-gray-200 overflow-hidden shadow-sm" />;
}
