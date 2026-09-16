"use client";

import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Shield,
  Siren,
  Heart,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function EmergencyPage() {
  const { user } = useUser();
  const [sosActive, setSosActive] = useState(false);
  const [activating, setActivating] = useState(false);

  const activateSOS = async () => {
    setActivating(true);
    // Simulate SOS activation
    await new Promise((r) => setTimeout(r, 1500));
    setSosActive(true);
    setActivating(false);
  };

  const deactivateSOS = () => {
    setSosActive(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* SOS Button */}
      <div
        className={`rounded-2xl p-8 text-center transition-all ${
          sosActive
            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
            : "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
        }`}
      >
        {sosActive ? (
          <div className="animate-fade-in">
            <CheckCircle2 className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">SOS Activated</h2>
            <p className="text-emerald-100 mb-6">
              Emergency services have been notified. Help is on the way.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Radio className="w-6 h-6 mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-medium">Live Location Shared</p>
                <p className="text-xs text-emerald-200 mt-1">
                  Your location is being shared with emergency contacts
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Siren className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Services Notified</p>
                <p className="text-xs text-emerald-200 mt-1">
                  Nearby hospitals and ambulance services alerted
                </p>
              </div>
            </div>

            <button
              onClick={deactivateSOS}
              className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
            >
              Deactivate SOS
            </button>
          </div>
        ) : (
          <div>
            <AlertTriangle className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Emergency SOS</h2>
            <p className="text-red-100 mb-8 max-w-sm mx-auto">
              One tap to alert emergency services, share your location, and
              notify your emergency contacts.
            </p>

            <button
              onClick={activateSOS}
              disabled={activating}
              className="w-48 h-48 rounded-full bg-white text-red-600 font-bold text-2xl mx-auto flex items-center justify-center hover:bg-red-50 transition-all shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activating ? (
                <div className="text-center">
                  <svg
                    className="animate-spin w-12 h-12 mx-auto mb-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span className="text-lg">Activating...</span>
                </div>
              ) : (
                <div className="text-center">
                  <Siren className="w-12 h-12 mx-auto mb-2" />
                  <span>SOS</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Emergency Contacts</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">Ambulance</span>
              <span className="text-sm font-bold text-red-600">108</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">Police</span>
              <span className="text-sm font-bold text-blue-600">100</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">Fire</span>
              <span className="text-sm font-bold text-amber-600">101</span>
            </div>
            {user?.emergencyContact && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-sm text-gray-700">Personal Contact</span>
                <span className="text-sm font-bold text-emerald-600">
                  {user.emergencyContact}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">SOS Features</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <MapPin className="w-4 h-4 text-gray-400" />
              Shares live GPS location
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <Phone className="w-4 h-4 text-gray-400" />
              Notifies emergency contacts
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <Siren className="w-4 h-4 text-gray-400" />
              Alerts nearby emergency services
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <Heart className="w-4 h-4 text-gray-400" />
              Finds nearest available hospital
            </div>
          </div>
        </div>
      </div>

      {/* User Health Info */}
      {user && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">
            Your Emergency Health Card
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-xs">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-xs">Blood Group</p>
              <p className="font-bold text-red-600 text-lg">
                {user.bloodGroup || "Not set"}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-xs">Phone</p>
              <p className="font-medium">{user.phone || "Not set"}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-xs">Emergency Contact</p>
              <p className="font-medium">
                {user.emergencyContact || "Not set"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
