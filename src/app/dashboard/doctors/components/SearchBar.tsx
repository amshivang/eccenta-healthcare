"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building2, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string, location?: { type: 'nearby' | 'city'; value?: string }) => void;
  onClear: () => void;
}

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [cityMode, setCityMode] = useState(false);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<{ results: string[]; resolvedQuery?: string; wasResolved?: boolean } | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("eccenta_recent_searches");
        if (saved) return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const specializations = [
    "General Physician", "Cardiologist", "Dermatologist", "Orthopedic", 
    "Pediatrician", "Gynecologist", "Neurologist", "ENT", 
    "Psychiatrist", "Ophthalmologist", "Dentist", "Oncologist", 
    "Physiotherapist", "Gastroenterologist", "Pulmonologist"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (q: string) => {
    if (!q.trim()) {
      setSuggestions(null);
      return;
    }
    try {
      const res = await fetch(`/api/doctors/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (e) {
      console.error("Error fetching suggestions", e);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) fetchSuggestions(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("eccenta_recent_searches", JSON.stringify(newRecent));
    
    setShowDropdown(false);
    onSearch(query, cityMode ? { type: 'city', value: city } : { type: 'nearby' });
  };

  const handleSelectSearch = (q: string) => {
    setQuery(q);
    setShowDropdown(false);
    onSearch(q, cityMode ? { type: 'city', value: city } : { type: 'nearby' });
  };

  const clearSearch = () => {
    setQuery("");
    setCity("");
    setSuggestions(null);
    onClear();
  };

  return (
    <div className="w-full relative animate-fade-in z-20" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, specializations, symptoms..."
              className="w-full pl-12 pr-10 py-4 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none text-lg"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="relative flex items-center w-full md:w-80 bg-white rounded-xl border border-gray-200 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <button
              type="button"
              onClick={() => {
                setCityMode(false);
                setCity("");
              }}
              className={`flex items-center gap-1.5 px-4 py-4 font-medium transition-colors ${!cityMode ? 'text-cyan-600 bg-cyan-50 rounded-l-xl' : 'text-gray-500 hover:text-gray-700'}`}
              title="Use current location"
            >
              <MapPin className="w-5 h-5" /> 
              <span className="hidden sm:inline">{!cityMode ? "Nearby" : ""}</span>
            </button>
            <div className="w-px h-8 bg-gray-200 mx-1"></div>
            <div className="relative flex-1">
              <Building2 className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 ${cityMode ? 'text-cyan-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search by city..."
                className="w-full pl-8 pr-3 py-4 bg-transparent outline-none text-gray-700"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setCityMode(e.target.value.trim().length > 0);
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Search
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (query || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-30">
          {suggestions?.wasResolved && suggestions.resolvedQuery && (
            <div className="bg-cyan-50 p-3 text-cyan-800 text-sm font-medium border-b border-cyan-100 flex items-center gap-2">
              <Search className="w-4 h-4" /> Showing results for {suggestions.resolvedQuery}
            </div>
          )}
          <div className="p-2">
            {suggestions?.results && suggestions.results.length > 0 ? (
              <>
                <p className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">Suggestions</p>
                {suggestions.results.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSearch(res)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-gray-700"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    {res}
                  </button>
                ))}
              </>
            ) : null}

            {!suggestions?.results?.length && recentSearches.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider mt-2">Recent Searches</p>
                {recentSearches.map((res, i) => (
                  <button
                    key={`recent-${i}`}
                    onClick={() => handleSelectSearch(res)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-gray-600"
                  >
                    <Search className="w-4 h-4 text-gray-300" />
                    {res}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick chips */}
      <div className="mt-4 flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {specializations.map((spec) => (
          <button
            key={spec}
            onClick={() => handleSelectSearch(spec)}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50 whitespace-nowrap transition-colors"
          >
            {spec}
          </button>
        ))}
      </div>
    </div>
  );
}
