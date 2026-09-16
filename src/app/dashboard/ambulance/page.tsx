"use client";

import { useState, useEffect } from "react";
import { useGlobalLocation } from "@/context/LocationContext";
import { MapPin, Navigation, Siren, Phone, ShieldAlert, Heart, Building2, Clock, Search, Star, Route, X, Activity, AlertTriangle, CheckCircle2, ChevronRight, Stethoscope, PhoneCall } from "lucide-react";
import AmbulanceTracker from "./components/AmbulanceTracker";

interface Ambulance {
  id: number;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: string;
  latitude: string;
  longitude: string;
  hospitalId: number;
  hospitalName: string;
  distance: number;
  providerName: string;
  ambulanceType: string;
  baseFare: number;
  rating: number;
}

interface Hospital {
  id: number;
  name: string;
  type: string;
  emergency: boolean;
  latitude: string;
  longitude: string;
  distance: number;
  phone: string;
}

const MOCK_HOSPITALS: Hospital[] = [
  { id: 1, name: "City General Hospital", type: "Public", emergency: true, latitude: "28.61", longitude: "77.21", distance: 2.3, phone: "102" },
  { id: 2, name: "Metro Care Hospital", type: "Private", emergency: true, latitude: "28.62", longitude: "77.22", distance: 4.1, phone: "108" },
  { id: 3, name: "Sunrise Medical Center", type: "Private", emergency: true, latitude: "28.63", longitude: "77.23", distance: 5.8, phone: "108" }
];

export default function AmbulancePage() {
  const { location, address, loading: locLoading } = useGlobalLocation();
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingAmb, setLoadingAmb] = useState(true);
  const [loadingHosp, setLoadingHosp] = useState(true);
  const [activeRequest, setActiveRequest] = useState<Ambulance | null>(null);
  const [isEmergencySOS, setIsEmergencySOS] = useState(false);

  useEffect(() => {
    // Fetch nearest ambulances
    const url = location 
      ? `/api/ambulance?lat=${location.lat}&lng=${location.lng}&radius=50`
      : '/api/ambulance';
      
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAmbulances(data);
        }
        setLoadingAmb(false);
      })
      .catch(() => setLoadingAmb(false));
  }, [location]);

  useEffect(() => {
    // Fetch emergency hospitals
    const url = location 
      ? `/api/hospitals/emergency?lat=${location.lat}&lng=${location.lng}&radius=50`
      : '/api/hospitals/emergency';
      
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHospitals(data);
        } else {
          setHospitals(MOCK_HOSPITALS);
        }
        setLoadingHosp(false);
      })
      .catch(() => {
        setHospitals(MOCK_HOSPITALS);
        setLoadingHosp(false);
      });
  }, [location]);

  const triggerSOS = async () => {
    setIsEmergencySOS(true);
    if (ambulances.length > 0) {
      await requestAmbulance(ambulances[0]);
    } else {
      alert("No available ambulances found in immediate vicinity. Please call 108 immediately.");
    }
    setIsEmergencySOS(false);
  };

  const requestAmbulance = async (amb: Ambulance) => {
    try {
      const res = await fetch('/api/ambulance', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ambulanceId: amb.id,
          pickupLatitude: location ? location.lat : 26.8467,
          pickupLongitude: location ? location.lng : 80.9462,
          pickupAddress: address || "Current GPS Location",
          destinationHospitalId: amb.hospitalId || null,
        }) 
      });
      if (res.ok) {
        setActiveRequest(amb);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to book ambulance. Please try again or call 108.");
      }
    } catch (err) {
      console.error("Ambulance request error:", err);
      alert("Network error requesting ambulance. Please call emergency services (108) directly.");
    }
  };

  const cancelRequest = () => {
    setActiveRequest(null);
  };

  if (activeRequest) {
    return (
        <div className="space-y-6 animate-fade-in relative pb-20">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={cancelRequest} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-white text-red-600 rounded-2xl shadow-lg">
                        <Siren className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Ambulance on the way</h1>
                        <p className="text-red-100 flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" /> Arriving in ~{Math.round(activeRequest.distance * 3)} mins
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative -mt-6 z-10 mx-4">
                <AmbulanceTracker 
                    pickupLat={location ? Number(location.lat) : undefined} 
                    pickupLng={location ? Number(location.lng) : undefined}
                    etaMinutes={Math.round(activeRequest.distance * 3)}
                />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mx-4">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Driver & Vehicle Details</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold">{activeRequest.driverName.charAt(0)}</span>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{activeRequest.driverName}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {activeRequest.rating} Rating
                            </p>
                        </div>
                    </div>
                    <a href={`tel:${activeRequest.driverPhone}`} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                        <Phone className="w-6 h-6" />
                    </a>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-xs text-gray-500 mb-1">Vehicle No.</p>
                        <p className="font-bold text-gray-900">{activeRequest.vehicleNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-xs text-gray-500 mb-1">Type</p>
                        <p className="font-bold text-gray-900 truncate" title={activeRequest.ambulanceType}>{activeRequest.ambulanceType}</p>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      {/* Top Banner & SOS */}
      <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between relative z-10">
              <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold mb-3">
                      <Activity className="w-4 h-4" /> Emergency Services
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Need Immediate Help?</h1>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto md:mx-0">
                      Tap the SOS button to instantly notify emergency services and dispatch the nearest ambulance.
                  </p>
                  
                  {location && (
                    <div className="inline-flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="truncate max-w-[200px] md:max-w-xs">{address || "Fetching your location..."}</span>
                    </div>
                  )}
              </div>
              
              <button 
                onClick={triggerSOS}
                disabled={isEmergencySOS}
                className={`group relative flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center border-[8px] transition-all duration-300 ${
                    isEmergencySOS 
                    ? "bg-red-700 border-red-800 scale-95 shadow-inner" 
                    : "bg-red-600 border-red-100 hover:border-red-200 shadow-2xl hover:shadow-red-500/50 hover:-translate-y-1"
                }`}
              >
                  <div className={`absolute inset-0 rounded-full border-[12px] border-white/20 ${isEmergencySOS ? 'animate-ping' : ''}`}></div>
                  <Siren className={`w-12 h-12 text-white mb-2 ${isEmergencySOS ? 'animate-pulse' : ''}`} />
                  <span className="text-white font-black text-2xl tracking-wider">SOS</span>
                  <span className="text-red-100 text-xs mt-1 font-medium">{isEmergencySOS ? 'NOTIFYING...' : 'TAP IN EMERGENCY'}</span>
              </button>
          </div>
      </div>

      {/* Emergency Hospitals Horizontal Scroll */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-600" /> Nearby ER Hospitals
            </h2>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 px-2 snap-x hide-scrollbar">
            {loadingHosp ? (
                [1,2,3].map(i => <div key={i} className="min-w-[280px] h-32 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0" />)
            ) : hospitals.length === 0 ? (
                <div className="w-full text-center py-6 text-gray-500">No emergency hospitals found nearby.</div>
            ) : (
                hospitals.map(hosp => (
                    <div key={hosp.id} className="min-w-[280px] md:min-w-[320px] snap-center bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex-shrink-0 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900 truncate pr-2">{hosp.name}</h3>
                                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">ER</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" /> {hosp.distance.toFixed(1)} km away
                            </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <a href={`tel:${hosp.phone}`} className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5 border border-gray-100">
                                <PhoneCall className="w-4 h-4 text-green-600" /> Call
                            </a>
                            {location && (
                                <a 
                                    href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${hosp.latitude},${hosp.longitude}`}
                                    target="_blank" rel="noreferrer"
                                    className="flex-1 bg-cyan-50 text-cyan-700 py-2 rounded-xl text-sm font-medium hover:bg-cyan-100 transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <Route className="w-4 h-4" /> Navigate
                                </a>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Nearby Ambulances */}
      <div className="space-y-4 px-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-cyan-600" /> Available Ambulances
        </h2>
        
        {loadingAmb || locLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
        ) : ambulances.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-10 h-10 text-red-400" />
                </div>
                <p className="text-xl font-bold text-gray-900">No available ambulances found nearby</p>
                <p className="text-gray-500 mt-2">Try contacting hospitals directly or call emergency services.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ambulances.map((amb) => (
                    <div key={amb.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
                        <div className="p-5 border-b border-gray-50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-sm">
                                        <Siren className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{amb.providerName}</h3>
                                        <p className="text-sm text-gray-500">{amb.ambulanceType}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mt-4 bg-gray-50 rounded-2xl p-3">
                                <div className="text-center border-r border-gray-200">
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Distance</p>
                                    <p className="font-bold text-gray-900 text-sm mt-0.5">{amb.distance !== undefined ? amb.distance.toFixed(1) : "N/A"} km</p>
                                </div>
                                <div className="text-center border-r border-gray-200">
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">ETA</p>
                                    <p className="font-bold text-gray-900 text-sm mt-0.5 text-blue-600">~{amb.distance !== undefined ? Math.round(amb.distance * 3) : "--"} min</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Base Fare</p>
                                    <p className="font-bold text-gray-900 text-sm mt-0.5">₹{amb.baseFare}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col justify-end">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-600">{amb.driverName?.charAt(0) || "D"}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">{amb.driverName}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-bold text-amber-700">{amb.rating}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button 
                                    onClick={() => requestAmbulance(amb)}
                                    className="flex-[2] bg-red-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-md hover:shadow-red-500/30 text-center"
                                >
                                    Request Now
                                </button>
                                <a
                                    href={`tel:${amb.driverPhone}`}
                                    className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center"
                                    title="Call Driver"
                                >
                                    <Phone className="w-5 h-5" />
                                </a>
                                {location && amb.latitude && amb.longitude && (
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${amb.latitude},${amb.longitude}`}
                                        target="_blank" rel="noreferrer"
                                        className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center"
                                        title="Directions"
                                    >
                                        <Route className="w-5 h-5 text-cyan-600" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
      
      {/* CSS for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
