"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import SearchBar from "./components/SearchBar";
import FilterPanel, { FilterState } from "./components/FilterPanel";
import AIAssistant from "./components/AIAssistant";
import BestDoctorsSection from "./components/BestDoctorsSection";
import DoctorCard from "./components/DoctorCard";
import DoctorMapView from "./components/DoctorMapView";
import BookingModal from "./components/BookingModal";
import { Filter, Map as MapIcon, List, Stethoscope } from "lucide-react";
import { useGlobalLocation } from "@/context/LocationContext";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: string;
  rating: string;
  totalReviews: number;
  profileImage: string | null;
  hospitalName: string | null;
  onlineAvailable: boolean;
  offlineAvailable: boolean;
  latitude?: string | null;
  longitude?: string | null;
  distance?: number;
  gender?: string;
}

const DEFAULT_DOCTORS: Doctor[] = [
  { id: 1, name: "Pratishtha Clinic, Dr. A.P Pandey", specialization: "General Physician", qualification: "MBBS, MD (Medicine)", experience: 16, consultationFee: "450", rating: "4.9", totalReviews: 120, profileImage: null, hospitalName: "Vinay Khand Clinic", onlineAvailable: true, offlineAvailable: true, latitude: "26.853663", longitude: "81.003978", distance: 1.2, gender: "Male" },
  { id: 2, name: "Dr. Isha Singh's Dermapathy Skin Clinic", specialization: "Dermatologist", qualification: "MBBS, MD (Dermatology)", experience: 14, consultationFee: "600", rating: "5.0", totalReviews: 240, profileImage: null, hospitalName: "Vijayant Khand Clinic", onlineAvailable: true, offlineAvailable: true, latitude: "26.866557", longitude: "81.020236", distance: 2.5, gender: "Female" },
  { id: 3, name: "Family Dental Care Implant Centre", specialization: "Dentist", qualification: "BDS, MDS", experience: 12, consultationFee: "400", rating: "4.9", totalReviews: 185, profileImage: null, hospitalName: "Vardan Khand Dental Hub", onlineAvailable: true, offlineAvailable: true, latitude: "26.838401", longitude: "81.009820", distance: 3.1, gender: "Male" },
  { id: 4, name: "HEAL AND CURE MEDICAL CENTRE", specialization: "Orthopedic", qualification: "MBBS, MS (Orthopedics)", experience: 19, consultationFee: "700", rating: "4.9", totalReviews: 310, profileImage: null, hospitalName: "Gomti Nagar Medical Centre", onlineAvailable: true, offlineAvailable: true, latitude: "26.857617", longitude: "81.003439", distance: 1.8, gender: "Male" },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const defaultFilters: FilterState = {
    distance: null,
    minRating: null,
    availability: null,
    consultationType: null,
    gender: null,
    minFee: null,
    maxFee: null,
  };
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const { location: userLocation } = useGlobalLocation();

  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors];

    if (filters.distance) {
      filtered = filtered.filter(d => d.distance && d.distance <= filters.distance!);
    }
    if (filters.minRating) {
      filtered = filtered.filter(d => parseFloat(d.rating) >= filters.minRating!);
    }
    if (filters.consultationType) {
      if (filters.consultationType === 'Online') filtered = filtered.filter(d => d.onlineAvailable);
      else if (filters.consultationType === 'Offline') filtered = filtered.filter(d => d.offlineAvailable);
      else if (filters.consultationType === 'Both') filtered = filtered.filter(d => d.onlineAvailable && d.offlineAvailable);
    }
    if (filters.gender) {
      filtered = filtered.filter(d => d.gender === filters.gender);
    }
    if (filters.minFee !== null) {
      filtered = filtered.filter(d => parseInt(d.consultationFee) >= filters.minFee!);
    }
    if (filters.maxFee !== null) {
      filtered = filtered.filter(d => parseInt(d.consultationFee) <= filters.maxFee!);
    }

    return filtered;
  }, [doctors, filters]);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (userLocation) {
      params.set("lat", userLocation.lat.toString());
      params.set("lng", userLocation.lng.toString());
      params.set("radius", "50");
    }

    fetch(`/api/doctors?${params}`)
      .then(async (res) => {
        let data: Doctor[] = [];
        if (res.ok) {
          data = await res.json();
        } else {
          data = DEFAULT_DOCTORS;
        }
        if (!ignore) {
          setDoctors(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          setDoctors(DEFAULT_DOCTORS);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [userLocation]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const handleSearch = async (query: string, location?: any) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (location) {
        params.set("lat", location.lat.toString());
        params.set("lng", location.lng.toString());
        params.set("radius", "50");
      }
      const res = await fetch(`/api/doctors?${params}`);
      let data: Doctor[] = [];
      if (res.ok) {
        data = await res.json();
      } else {
        data = DEFAULT_DOCTORS;
      }
      setDoctors(data);
    } catch (err) {
      console.error(err);
      setDoctors(DEFAULT_DOCTORS);
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-20">
      
      {/* Search Bar Area */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-6 md:p-10 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find the Right Doctor</h1>
          <p className="text-cyan-100 mb-8 text-lg">Book appointments with top specialists near you.</p>
          <SearchBar onSearch={(q) => handleSearch(q, userLocation)} onClear={() => handleSearch("", userLocation)} />
        </div>
      </div>

      <BestDoctorsSection onBook={openBooking} />

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        <FilterPanel 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={clearFilters}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Results Area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {loading ? "Searching..." : `${filteredDoctors.length} Doctors Found`}
            </h2>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>

              <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-cyan-50 text-cyan-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" /> <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-cyan-50 text-cyan-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <MapIcon className="w-4 h-4" /> <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-900">No doctors found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you&apos;re looking for.</p>
              <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-cyan-50 text-cyan-700 font-bold rounded-xl hover:bg-cyan-100 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
                {filteredDoctors.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} onBook={openBooking} userLocation={userLocation || undefined} />
                ))}
              </div>
            ) : (
              <DoctorMapView doctors={filteredDoctors} userLocation={userLocation || undefined} />
            )
          )}
        </div>
      </div>

      <AIAssistant onFindDoctors={(spec) => handleSearch(spec)} />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        doctor={selectedDoctor} 
      />
    </div>
  );
}
