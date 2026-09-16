"use client";

import { useState, useEffect } from "react";
import {
  Droplets,
  MapPin,
  Phone,
  AlertCircle,
} from "lucide-react";

interface BloodInventoryItem {
  id: number;
  bloodGroup: string;
  unitsAvailable: number;
}

interface BloodBank {
  id: number;
  name: string;
  address: string;
  phone: string;
  inventory: BloodInventoryItem[];
}

export default function BloodBanksPage() {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState("");

  useEffect(() => {
    fetch("/api/blood-banks")
      .then((r) => r.json())
      .then(setBloodBanks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const getAvailabilityColor = (units: number) => {
    if (units > 15) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (units > 5) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 bg-gray-200 rounded-2xl" />
        {[1, 2].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Filter by Blood Group
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterGroup("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !filterGroup
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Groups
          </button>
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setFilterGroup(bg)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterGroup === bg
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Blood Banks */}
      {bloodBanks.length === 0 ? (
        <div className="text-center py-16">
          <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-500">
            No blood banks found
          </p>
        </div>
      ) : (
        bloodBanks.map((bank) => {
          const filteredInventory = filterGroup
            ? bank.inventory.filter((inv) => inv.bloodGroup === filterGroup)
            : bank.inventory;

          return (
            <div
              key={bank.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {bank.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {bank.address}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3.5 h-3.5" /> {bank.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {filteredInventory.map((inv) => (
                    <div
                      key={inv.id}
                      className={`rounded-xl p-4 text-center border ${getAvailabilityColor(
                        inv.unitsAvailable
                      )}`}
                    >
                      <p className="text-2xl font-bold">{inv.bloodGroup}</p>
                      <p className="text-sm mt-1">
                        {inv.unitsAvailable} units
                      </p>
                      {inv.unitsAvailable <= 5 && (
                        <p className="text-xs mt-1 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Low stock
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
