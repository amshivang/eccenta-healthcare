"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Pill,
  MapPin,
  Clock,
  Star,
  Phone,
  Package,
  IndianRupee,
  ShoppingBag,
  CheckCircle2,
  Navigation,
  Sparkles,
  Tag,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Info,
} from "lucide-react";
import { useGlobalLocation } from "@/context/LocationContext";

interface MedicineResult {
  pharmacyId: number;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  rating: string;
  medicineName: string;
  genericName: string | null;
  category: string | null;
  manufacturer: string | null;
  description: string | null;
  price: string;
  quantity: number;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
}

interface MedicineSuggestion {
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  defaultPrice: number;
  form: string;
}

const CATEGORIES = [
  "All",
  "Pain & Fever",
  "Gastro & Acidity",
  "Cold & Allergy",
  "Antibiotics",
  "Cardiac & BP",
  "Diabetes",
  "First Aid & Skin",
  "Vitamins & Supplements",
];

export default function MedicinesPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MedicineResult[]>([]);
  const [suggestions, setSuggestions] = useState<MedicineSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [reserved, setReserved] = useState<Set<number>>(new Set());
  const [reserveToast, setReserveToast] = useState<string | null>(null);
  const { location } = useGlobalLocation();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Autocomplete fetcher with debouncing
  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/pharmacies?medicine=${encodeURIComponent(search.trim())}&suggest=true`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
          }
        }
      } catch (err) {
        // quiet error
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [search]);

  // Click outside listener for suggestions dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerSearch = async (queryTerm: string) => {
    if (!queryTerm.trim()) return;
    setLoading(true);
    setSearched(true);
    setShowSuggestions(false);

    try {
      let url = `/api/pharmacies?medicine=${encodeURIComponent(queryTerm.trim())}`;
      if (location) {
        url += `&lat=${location.lat}&lng=${location.lng}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(search);
  };

  const handleSuggestionClick = (medName: string) => {
    setSearch(medName);
    triggerSearch(medName);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      triggerSearch("fever");
    } else {
      triggerSearch(cat);
    }
  };

  const handleReserve = (pharmacyId: number, pharmacyName: string) => {
    setReserved((prev) => new Set([...prev, pharmacyId]));
    setReserveToast(`Medicine reserved at ${pharmacyName}! Present your reservation at the counter.`);
    setTimeout(() => setReserveToast(null), 4000);
  };

  const popularMedicines = [
    "Dolo 650",
    "Pan D",
    "Allegra 120",
    "Augmentin 625",
    "Azithral 500",
    "Thyronorm",
    "Crocin",
    "Combiflam",
    "Telma 40",
    "Glycomet 500",
    "Becosules",
    "Cough Syrup",
    "Betadine",
    "Volini",
  ];

  // Best price calculation among search results
  const minPrice = results.length > 0 ? Math.min(...results.map(r => parseFloat(r.price) || 0).filter(p => p > 0)) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {reserveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{reserveToast}</span>
        </div>
      )}

      {/* Universal Search Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Universal Medical Search
              </span>
              <span className="text-xs text-gray-400">• 180+ Lucknow Pharmacies Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Find Any Medicine in Lucknow
            </h1>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Search all prescription brands, generic salts, symptoms (e.g. fever, acidity, cough), or therapeutic categories with live stock and price comparisons.
        </p>

        {/* Search Input Bar with Autocomplete */}
        <div ref={searchContainerRef} className="relative">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search any medicine, salt, or symptom (e.g., Dolo, Pan-D, Allegra, Cough, Acidity)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all text-gray-800 text-sm sm:text-base"
                value={search}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearch(val);
                  if (!val.trim() || val.trim().length < 2) {
                    setSuggestions([]);
                  }
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl hover:from-cyan-700 hover:to-blue-700 transition-all font-semibold text-sm sm:text-base shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40 max-h-80 overflow-y-auto divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                Suggested Medications & Salts
              </div>
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSuggestionClick(item.name)}
                  className="px-4 py-3 hover:bg-cyan-50/60 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-cyan-700 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        <span className="text-cyan-600 font-medium">{item.form}</span> • {item.genericName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600">~₹{item.defaultPrice.toFixed(0)}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-cyan-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">Popular Searches:</span>
          {popularMedicines.map((med) => (
            <button
              key={med}
              onClick={() => {
                setSearch(med);
                triggerSearch(med);
              }}
              className="px-3 py-1 bg-gray-100/80 hover:bg-cyan-50 hover:text-cyan-700 text-gray-600 rounded-full text-xs font-medium transition-all"
            >
              {med}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200/70 rounded-3xl" />
          ))}
        </div>
      ) : searched && results.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-bounce" />
          <p className="text-xl font-bold text-gray-800">
            Scanning Network Pharmacies...
          </p>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Try searching by chemical salt (e.g., Paracetamol, Pantoprazole) or symptom (e.g., fever, headache, acidity).
          </p>
        </div>
      ) : results.length > 0 ? (
        <div>
          {/* Header with info & active salt */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Found {results.length} Pharmacies with {results[0]?.medicineName || search}
              </h2>
              {results[0]?.genericName && (
                <p className="text-xs sm:text-sm text-cyan-700 font-medium flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Active Composition: <span className="font-semibold">{results[0].genericName}</span>
                </p>
              )}
            </div>
            {minPrice > 0 && (
              <div className="self-start sm:self-auto px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                Best Price in Lucknow: ₹{minPrice.toFixed(2)}
              </div>
            )}
          </div>

          {/* Pharmacy Result Cards */}
          <div className="space-y-3.5">
            {results.map((r, i) => {
              const isBestPrice = parseFloat(r.price) === minPrice;
              return (
                <div
                  key={`${r.pharmacyId}-${i}`}
                  className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all hover:shadow-md relative overflow-hidden ${
                    isBestPrice ? "border-emerald-200 ring-1 ring-emerald-500/20" : "border-gray-100"
                  }`}
                >
                  {isBestPrice && (
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                      Lowest Price
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    {/* Pharmacy Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-700 shadow-inner">
                      <ShoppingBag className="w-7 h-7" />
                    </div>

                    {/* Pharmacy & Medicine Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                            {r.pharmacyName}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" /> {r.pharmacyAddress}
                          </p>
                          {r.distance != null && (
                            <p className="text-xs font-bold text-cyan-600 mt-1 flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              {r.distance.toFixed(1)} km from your location
                            </p>
                          )}
                        </div>

                        {/* Price & Medicine Name */}
                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-2xl font-black text-emerald-600">
                              ₹{parseFloat(r.price).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-800 mt-0.5">{r.medicineName}</p>
                          {r.manufacturer && (
                            <p className="text-[11px] text-gray-400">By {r.manufacturer}</p>
                          )}
                        </div>
                      </div>

                      {/* Stock & Operating Details */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3.5">
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {r.rating} Rating
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {r.openTime?.slice(0, 5)} - {r.closeTime?.slice(0, 5)}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {r.pharmacyPhone}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                            r.quantity > 10
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : r.quantity > 0
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          <Package className="w-3.5 h-3.5" />
                          {r.quantity > 10
                            ? `In Stock (${r.quantity} available)`
                            : r.quantity > 0
                            ? `Low Stock (${r.quantity} left)`
                            : "Out of Stock"}
                        </span>
                        {r.isOpen ? (
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                            ● Open Now
                          </span>
                        ) : (
                          <span className="text-xs font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-lg">
                            ● Closed
                          </span>
                        )}
                      </div>

                      {/* Generic composition & description */}
                      {r.description && (
                        <p className="text-xs text-gray-500 mt-2.5 bg-gray-50/70 p-2 rounded-xl flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0 mt-0.5" />
                          <span>{r.description}</span>
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex lg:flex-col gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      <a
                        href={
                          r.latitude && r.longitude
                            ? `https://www.google.com/maps/dir/?api=1${location ? `&origin=${location.lat},${location.lng}` : ""}&destination=${r.latitude},${r.longitude}`
                            : `https://www.google.com/maps/dir/?api=1${location ? `&origin=${location.lat},${location.lng}` : ""}&destination=${encodeURIComponent(r.pharmacyName + ", " + r.pharmacyAddress)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 lg:flex-none px-4 py-2.5 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs font-bold border border-cyan-100"
                        title="Get Turn-by-Turn Directions"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </a>
                      {reserved.has(r.pharmacyId) ? (
                        <button
                          disabled
                          className="flex-1 lg:flex-none px-4 py-2.5 text-xs bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reserved
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReserve(r.pharmacyId, r.pharmacyName)}
                          disabled={r.quantity === 0}
                          className="flex-1 lg:flex-none px-5 py-2.5 text-xs bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reserve at Counter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        !searched && (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto mb-4">
              <Pill className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Universal Medicine Availability in Real-Time
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
              Search by brand name (e.g., Crocin, Dolo, Pan-D), generic salt (e.g., Paracetamol, Pantoprazole), or symptom to see stock across 180+ verified Lucknow pharmacies.
            </p>
          </div>
        )
      )}
    </div>
  );
}
