"use client";

import { useState, useEffect, useCallback } from "react";
import { Bed, Users, AlertCircle, Activity, Plus, Minus, RefreshCw } from "lucide-react";

interface Stats {
  totalBeds: number;
  availableBeds: number;
  doctorsCount: number;
  activeAmbulances: number;
  hospitalId: number;
}

interface BedData {
  id: number;
  bedType: string;
  totalBeds: number;
  availableBeds: number;
  updatedAt: string;
}

export default function HospitalAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [beds, setBeds] = useState<BedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBed, setUpdatingBed] = useState<string | null>(null);

  const refreshData = () => {
    Promise.all([
      fetch("/api/hospital-admin/stats"),
      fetch("/api/hospital-admin/beds")
    ])
      .then(async ([statsRes, bedsRes]) => {
        if (statsRes.ok && bedsRes.ok) {
          const statsData = await statsRes.json();
          const bedsData = await bedsRes.json();
          setStats(statsData);
          setBeds(bedsData);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetch("/api/hospital-admin/stats"),
      fetch("/api/hospital-admin/beds")
    ])
      .then(async ([statsRes, bedsRes]) => {
        if (!statsRes.ok) {
          if (statsRes.status === 401 || statsRes.status === 403) {
            throw new Error("Unauthorized. Please log in as a Hospital Admin.");
          }
          throw new Error("Failed to fetch dashboard data");
        }

        const statsData = await statsRes.json();
        const bedsData = await bedsRes.json();

        if (!ignore) {
          setStats(statsData);
          setBeds(bedsData);
          setError("");
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const updateBedCount = async (bedType: string, currentAvailable: number, currentTotal: number, increment: boolean) => {
    let newAvailable = increment ? currentAvailable + 1 : currentAvailable - 1;
    
    // Validation
    if (newAvailable < 0) newAvailable = 0;
    if (newAvailable > currentTotal) newAvailable = currentTotal;
    if (newAvailable === currentAvailable) return;

    try {
      setUpdatingBed(bedType);
      const res = await fetch("/api/hospital-admin/beds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bedType, availableBeds: newAvailable }),
      });

      if (!res.ok) throw new Error("Failed to update beds");

      // Update local state
      setBeds(beds.map(b => b.bedType === bedType ? { ...b, availableBeds: newAvailable } : b));
      // Refresh stats
      refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to update bed inventory.");
    } finally {
      setUpdatingBed(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          <AlertCircle className="mx-auto mb-4 h-12 w-12" />
          <h2 className="text-xl font-bold">Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const occupancyRate = stats 
    ? Math.round(((stats.totalBeds - stats.availableBeds) / stats.totalBeds) * 100) 
    : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hospital Admin Dashboard</h1>
        <button 
          onClick={refreshData}
          className="flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-teal-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Beds</h3>
            <Bed className="h-5 w-5 text-teal-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.totalBeds}</p>
          <p className="mt-1 text-sm text-gray-500">{stats?.availableBeds} currently available</p>
        </div>

        <div className="rounded-xl border border-teal-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{occupancyRate}%</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div 
              className={`h-full ${occupancyRate > 90 ? 'bg-red-500' : occupancyRate > 70 ? 'bg-amber-500' : 'bg-teal-500'}`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-teal-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Doctors</h3>
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.doctorsCount}</p>
          <p className="mt-1 text-sm text-gray-500">Associated with this hospital</p>
        </div>

        <div className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Active Emergencies</h3>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.activeAmbulances}</p>
          <p className="mt-1 text-sm text-red-600">Ambulances inbound</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bed Management */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900">Live Bed Inventory</h2>
            <p className="text-sm text-gray-500">Manage available beds in real-time</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {beds.map((bed) => (
                <div key={bed.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:border-teal-100">
                  <div>
                    <h4 className="font-semibold capitalize text-gray-900">{bed.bedType} Beds</h4>
                    <p className="text-sm text-gray-500">Total capacity: {bed.totalBeds}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex flex-col items-end ${bed.availableBeds < 5 ? 'text-red-600' : 'text-teal-600'}`}>
                      <span className="text-2xl font-bold">{bed.availableBeds}</span>
                      <span className="text-xs">Available</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateBedCount(bed.bedType, bed.availableBeds, bed.totalBeds, false)}
                        disabled={bed.availableBeds === 0 || updatingBed === bed.bedType}
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => updateBedCount(bed.bedType, bed.availableBeds, bed.totalBeds, true)}
                        disabled={bed.availableBeds === bed.totalBeds || updatingBed === bed.bedType}
                        className="rounded-full bg-teal-50 p-2 text-teal-600 hover:bg-teal-100 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity / Pending Tasks */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900">Hospital Administration</h2>
            <p className="text-sm text-gray-500">Quick actions and updates</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center text-gray-500">
              <Activity className="h-12 w-12 text-teal-200" />
              <p>More administrative modules (Doctors Management, Billing, Reports) will appear here in future updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
