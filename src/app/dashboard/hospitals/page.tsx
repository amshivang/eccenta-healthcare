"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Star,
  Bed,
  Activity,
  Heart,
  Baby,
  AlertTriangle,
  Wind,
  Mail,
  Navigation,
} from "lucide-react";

interface HospitalBed {
  id: number;
  bedType: string;
  totalBeds: number;
  availableBeds: number;
}

interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  rating: string;
  emergencyAvailable: boolean;
  latitude: number | null;
  longitude: number | null;
  distance?: number | null;
  beds: HospitalBed[];
}

import { useGlobalLocation } from "@/context/LocationContext";

const bedTypeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  icu: { icon: Heart, label: "ICU", color: "text-red-600 bg-red-50" },
  oxygen: { icon: Wind, label: "Oxygen", color: "text-blue-600 bg-blue-50" },
  general: { icon: Bed, label: "General", color: "text-emerald-600 bg-emerald-50" },
  pediatric: { icon: Baby, label: "Pediatric", color: "text-purple-600 bg-purple-50" },
  emergency: { icon: AlertTriangle, label: "Emergency", color: "text-amber-600 bg-amber-50" },
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const { location } = useGlobalLocation();

  useEffect(() => {
    let ignore = false;
    let url = "/api/hospitals";
    if (location) {
      url += `?lat=${location.lat}&lng=${location.lng}`;
    }
    
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!ignore) {
          setHospitals(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [location]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Live Bed Availability</h3>
            <p className="text-purple-100 mt-1 text-sm">
              Real-time hospital bed tracking across {hospitals.length} hospitals
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-dot" />
            <span className="text-sm font-medium">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Hospitals */}
      {hospitals.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-500">No hospitals found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hospitals.map((hospital) => {
            const totalBeds = hospital.beds.reduce(
              (s, b) => s + b.totalBeds,
              0
            );
            const totalAvailable = hospital.beds.reduce(
              (s, b) => s + b.availableBeds,
              0
            );
            const occupancy =
              totalBeds > 0
                ? Math.round(((totalBeds - totalAvailable) / totalBeds) * 100)
                : 0;

            return (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-purple-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {hospital.name}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" /> {hospital.address}
                          </p>
                          {hospital.distance != null && (
                            <p className="text-xs font-semibold text-purple-600 mt-1">
                              {hospital.distance.toFixed(1)} km Away
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {hospital.emergencyAvailable && (
                            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                              🚑 Emergency
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {hospital.rating}
                          </span>
                          <a 
                            href={hospital.latitude && hospital.longitude ? 
                              `https://www.google.com/maps/dir/?api=1${location ? `&origin=${location.lat},${location.lng}` : ''}&destination=${hospital.latitude},${hospital.longitude}` :
                              `https://www.google.com/maps/dir/?api=1${location ? `&origin=${location.lat},${location.lng}` : ''}&destination=${encodeURIComponent(hospital.name + ", " + hospital.address)}`
                            }
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-700 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors text-sm font-medium border border-cyan-100" 
                            title="Get Directions"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Directions</span>
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {hospital.phone}
                        </span>
                        {hospital.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> {hospital.email}
                          </span>
                        )}
                      </div>

                      {/* Occupancy Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">
                            Bed Occupancy: {occupancy}%
                          </span>
                          <span className="text-gray-500">
                            {totalAvailable} / {totalBeds} available
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              occupancy > 85
                                ? "bg-red-500"
                                : occupancy > 60
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${occupancy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bed Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-5">
                    {hospital.beds.map((bed) => {
                      const config = bedTypeConfig[bed.bedType] || {
                        icon: Bed,
                        label: bed.bedType,
                        color: "text-gray-600 bg-gray-50",
                      };
                      const Icon = config.icon;
                      const pct =
                        bed.totalBeds > 0
                          ? Math.round(
                              (bed.availableBeds / bed.totalBeds) * 100
                            )
                          : 0;

                      return (
                        <div
                          key={bed.id}
                          className={`rounded-xl p-3 ${config.color} border border-transparent`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase">
                              {config.label}
                            </span>
                          </div>
                          <p className="text-2xl font-bold">
                            {bed.availableBeds}
                          </p>
                          <p className="text-xs opacity-75">
                            of {bed.totalBeds} beds ({pct}%)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
