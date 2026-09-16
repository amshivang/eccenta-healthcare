"use client";

import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

export interface FilterState {
  distance: number | null;
  minRating: number | null;
  availability: string | null;
  consultationType: string | null;
  gender: string | null;
  minFee: number | null;
  maxFee: number | null;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function FilterPanel({ filters, onFilterChange, onClear, isMobileOpen, onMobileClose }: FilterPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    distance: true,
    rating: true,
    availability: true,
    consultation: true,
    gender: true,
    fee: true,
  });

  const toggleSection = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value === filters[key] ? null : value });
  };

  const updateFee = (min: number | null, max: number | null) => {
    const isSame = filters.minFee === min && filters.maxFee === max;
    onFilterChange({ ...filters, minFee: isSame ? null : min, maxFee: isSame ? null : max });
  };

  const content = (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Filter className="w-5 h-5 text-cyan-600" /> Filters
        </h2>
        <button onClick={onClear} className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
          Clear All
        </button>
      </div>

      {/* Distance */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('distance')} className="flex items-center justify-between w-full font-semibold text-gray-700">
          Distance
          {expanded.distance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.distance && (
          <div className="flex flex-wrap gap-2">
            {[2, 5, 10, 20].map(dist => (
              <button
                key={dist}
                onClick={() => updateFilter('distance', dist)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.distance === dist ? 'bg-cyan-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              >
                {dist} km
              </button>
            ))}
            <button
              onClick={() => updateFilter('distance', null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.distance === null ? 'bg-cyan-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
            >
              Anywhere
            </button>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('rating')} className="flex items-center justify-between w-full font-semibold text-gray-700">
          Rating
          {expanded.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.rating && (
          <div className="flex flex-wrap gap-2">
            {[4, 4.5, 5].map(rating => (
              <button
                key={rating}
                onClick={() => updateFilter('minRating', rating)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.minRating === rating ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              >
                {rating === 5 ? '5 Star' : `${rating}+`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('availability')} className="flex items-center justify-between w-full font-semibold text-gray-700">
          Availability
          {expanded.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.availability && (
          <div className="flex flex-wrap gap-2">
            {['Open Now', 'Open Today', 'Available Tomorrow'].map(avail => (
              <button
                key={avail}
                onClick={() => updateFilter('availability', avail)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.availability === avail ? 'bg-cyan-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              >
                {avail}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Consultation */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('consultation')} className="flex items-center justify-between w-full font-semibold text-gray-700">
          Consultation Mode
          {expanded.consultation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.consultation && (
          <div className="flex flex-wrap gap-2">
            {['Offline', 'Online', 'Both'].map(type => (
              <button
                key={type}
                onClick={() => updateFilter('consultationType', type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.consultationType === type ? 'bg-cyan-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('gender')} className="flex items-center justify-between w-full font-semibold text-gray-700">
          Gender
          {expanded.gender ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.gender && (
          <div className="flex flex-wrap gap-2">
            {['Male', 'Female', 'Any'].map(gender => (
              <button
                key={gender}
                onClick={() => updateFilter('gender', gender === 'Any' ? null : gender)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.gender === (gender === 'Any' ? null : gender) ? 'bg-cyan-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              >
                {gender}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fees */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('fee')} className="flex items-center justify-between w-full font-semibold text-gray-700">
          Fees
          {expanded.fee ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.fee && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFee(200, 500)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.minFee === 200 && filters.maxFee === 500 ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
            >
              ₹200-500
            </button>
            <button
              onClick={() => updateFee(500, 1000)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.minFee === 500 && filters.maxFee === 1000 ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
            >
              ₹500-1000
            </button>
            <button
              onClick={() => updateFee(1000, null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.minFee === 1000 && filters.maxFee === null ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
            >
              ₹1000+
            </button>
          </div>
        )}
      </div>
      
      <div className="pt-4 border-t border-gray-100 lg:hidden">
         <button onClick={onMobileClose} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl">
           Apply Filters
         </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 bg-white rounded-2xl border border-gray-100 shadow-sm flex-shrink-0 self-start sticky top-24">
        {content}
      </div>

      {/* Mobile Drawer/Bottom Sheet */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 transition-opacity">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white pt-4 pb-2 px-4 flex justify-center border-b border-gray-100 z-10">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2"></div>
              <button onClick={onMobileClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
