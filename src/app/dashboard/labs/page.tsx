"use client";

import { useState, useEffect, useCallback } from "react";
import { useGlobalLocation } from "@/context/LocationContext";
import { MapPin, Search, Navigation, FlaskConical, Phone, Clock, FileText, CheckCircle2 } from "lucide-react";

interface LabTest {
  id: number;
  name: string;
  description: string;
  price: string;
  reportTime: string;
}

interface Lab {
  id: number;
  name: string;
  address: string;
  phone: string;
  homeCollection: boolean;
  rating: string;
  distance?: number;
  latitude: string;
  longitude: string;
  tests: LabTest[];
}

export default function LabsPage() {
  const { location, loading: locLoading } = useGlobalLocation();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLabs = useCallback((query = "") => {
    let url = "/api/labs";
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (location) {
      params.set("lat", location.lat.toString());
      params.set("lng", location.lng.toString());
      params.set("radius", "50");
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    let ignore = false;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        if (Array.isArray(data)) {
          setLabs(data);
        } else {
          setLabs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        console.error(err);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [location]);

  useEffect(() => {
    const cancel = fetchLabs(search);
    return () => {
      if (cancel) cancel();
    };
  }, [fetchLabs, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchLabs(search);
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-20">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-700 p-6 md:p-10 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Lab Services</h1>
          </div>
          <p className="text-violet-100 mb-8 text-lg">
            Find diagnostic centers nearby, compare test prices, and book home sample collections.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search labs or tests (e.g., Blood Test, MRI)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 border-none outline-none focus:ring-2 focus:ring-violet-400 shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-violet-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-violet-50 transition-colors"
            >
              Search Labs
            </button>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {loading ? "Searching for diagnostic centers..." : `Nearby Diagnostic Centers (${labs.length})`}
        </h2>
      </div>

      {loading || locLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : labs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="w-10 h-10 text-violet-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">No labs found</p>
          <p className="text-gray-500 mt-2">Try a different search term or expand your area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {labs.map((lab) => (
            <div key={lab.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="p-6 border-b border-gray-100 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-xl">{lab.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-sm font-bold">
                    <span>★</span> {lab.rating}
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm flex items-start gap-1.5 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> {lab.address}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {lab.distance !== null && lab.distance !== undefined && (
                    <span className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-violet-500" /> {lab.distance.toFixed(1)} km
                    </span>
                  )}
                  {lab.homeCollection && (
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Home Collection
                    </span>
                  )}
                  <a href={`tel:${lab.phone}`} className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-100 transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {lab.phone}
                  </a>
                </div>

                {lab.tests && lab.tests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Available Tests</h4>
                    <div className="space-y-3">
                      {lab.tests.map(test => (
                        <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{test.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <FileText className="w-3 h-3" /> Report in {test.reportTime}
                            </p>
                          </div>
                          <span className="font-bold text-violet-700 text-sm">₹{test.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 flex gap-3">
                <button className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors">
                  Book Home Collection
                </button>
                {location && lab.latitude && lab.longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${lab.latitude},${lab.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    Directions
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
