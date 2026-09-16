"use client";

import { useEffect, useState, useRef } from "react";
import DoctorCard from "./DoctorCard";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

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
}

interface BestDoctorsSectionProps {
  onBook: (doctor: Doctor) => void;
}

const FALLBACK_DOCTORS: Doctor[] = [
  { id: 101, name: "Dr. Rahul Sharma", specialization: "Cardiologist", qualification: "MBBS, MD", experience: 15, consultationFee: "1000", rating: "4.9", totalReviews: 320, profileImage: null, hospitalName: "Apollo Hospital", onlineAvailable: true, offlineAvailable: true },
  { id: 102, name: "Dr. Priya Patel", specialization: "Dermatologist", qualification: "MBBS, DDVL", experience: 8, consultationFee: "700", rating: "4.8", totalReviews: 215, profileImage: null, hospitalName: "Skin Care Clinic", onlineAvailable: true, offlineAvailable: false },
  { id: 103, name: "Dr. Amit Kumar", specialization: "Neurologist", qualification: "MBBS, DM", experience: 12, consultationFee: "1200", rating: "4.7", totalReviews: 180, profileImage: null, hospitalName: "Fortis Escorts", onlineAvailable: false, offlineAvailable: true }
];

export default function BestDoctorsSection({ onBook }: BestDoctorsSectionProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;
    const fetchBestDoctors = async () => {
      try {
        const res = await fetch("/api/doctors?sortBy=rating&limit=5");
        if (ignore) return;
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setDoctors(data);
          } else {
            setDoctors(FALLBACK_DOCTORS);
          }
        } else {
          setDoctors(FALLBACK_DOCTORS);
        }
      } catch (err) {
        if (ignore) return;
        console.error(err);
        setDoctors(FALLBACK_DOCTORS);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchBestDoctors();
    return () => {
      ignore = true;
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[300px] h-48 bg-gray-200 rounded-2xl animate-pulse shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  if (doctors.length === 0) return null;

  return (
    <div className="w-full mb-8 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" /> 
          Top Rated Specialists
        </h2>
        
        <div className="flex gap-2 hidden sm:flex">
          <button onClick={() => scroll('left')} className="p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll('right')} className="p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {doctors.map(doc => (
          <div key={doc.id} className="min-w-[320px] md:min-w-[360px] max-w-[360px] snap-center shrink-0">
            <DoctorCard doctor={doc} onBook={onBook} />
          </div>
        ))}
      </div>
    </div>
  );
}
