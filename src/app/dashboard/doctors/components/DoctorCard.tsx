"use client";

import { Star, MapPin, Phone, Navigation, Clock, Heart, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DistanceBadge from "./DistanceBadge";

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
  distance?: number;
  latitude?: string | null;
  longitude?: string | null;
  clinicAddress?: string | null;
  city?: string | null;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  userLocation?: { lat: number; lng: number };
}

export default function DoctorCard({ doctor, onBook, userLocation }: DoctorCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Optimistic update
      setIsFavorited(!isFavorited);
      await fetch(`/api/doctors/${doctor.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "favorite" }),
      });
    } catch (err) {
      setIsFavorited(!isFavorited); // revert on error
    }
  };

  const openDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    const dest = (doctor.clinicAddress || doctor.hospitalName)
      ? `${doctor.name}, ${doctor.clinicAddress || doctor.hospitalName}`
      : (doctor.latitude && doctor.longitude ? `${doctor.latitude},${doctor.longitude}` : doctor.name);
    let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
    if (userLocation) {
      url += `&origin=${userLocation.lat},${userLocation.lng}`;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col h-full hover:-translate-y-0.5 relative group">
      <button 
        onClick={toggleFavorite}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors z-10"
      >
        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <div className="flex gap-4">
        {doctor.profileImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={doctor.profileImage} alt={doctor.name} loading="lazy" className="w-20 h-20 rounded-2xl object-cover" />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-inner">
            {doctor.name.split(" ").slice(-1)[0]?.[0] || "D"}
          </div>
        )}
        
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="font-bold text-gray-900 text-lg truncate">{doctor.name}</h3>
          <p className="text-sm text-cyan-600 font-semibold truncate">{doctor.specialization}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{doctor.qualification}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="text-xs font-bold text-amber-700">{doctor.rating}</span>
              <span className="text-[10px] text-amber-600">({doctor.totalReviews})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              <Clock className="w-3 h-3 text-gray-400" />
              {doctor.experience} Yrs Exp.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {doctor.hospitalName && (
          <p className="text-xs text-gray-600 flex items-start gap-1.5 line-clamp-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" /> 
            {doctor.hospitalName}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-2">
          {doctor.distance !== undefined && (
            <DistanceBadge distance={doctor.distance} />
          )}
          <span className="flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
            ₹{doctor.consultationFee}
          </span>
          {doctor.onlineAvailable && (
            <span className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">
              <Video className="w-3 h-3" /> Online
            </span>
          )}
          {doctor.offlineAvailable && (
            <span className="flex items-center gap-1 text-xs font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100">
              <MapPin className="w-3 h-3" /> Clinic
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center gap-2">
          <Link 
            href={`/dashboard/doctors/${doctor.id}`}
            className="flex-1 text-center px-3 py-2.5 text-sm text-cyan-700 border border-cyan-200 rounded-xl hover:bg-cyan-50 transition-colors font-semibold"
          >
            View Profile
          </Link>
          <button
            onClick={() => onBook(doctor)}
            className="flex-1 px-3 py-2.5 text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-md transition-all font-semibold"
          >
            Book
          </button>
          
          <div className="flex gap-2">
            <button className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors" title="Call Clinic">
              <Phone className="w-4 h-4" />
            </button>
            <button onClick={openDirections} className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm" title="Get Directions">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
