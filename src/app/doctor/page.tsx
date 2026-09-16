"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

interface DoctorStats {
  todayAppointments: number;
  totalPatients: number;
  totalAppointments: number;
}

interface AppointmentItem {
  id: number;
  patientId: number;
  patientName: string;
  patientPhone: string | null;
  patientBloodGroup: string | null;
  appointmentDate: string;
  appointmentTime: string;
  tokenNumber: number | null;
  status: "scheduled" | "in_queue" | "in_progress" | "completed" | "cancelled";
  queuePosition: number | null;
  estimatedWaitMinutes: number | null;
  notes: string | null;
}

export default function DoctorOverviewPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DoctorStats>({
    todayAppointments: 0,
    totalPatients: 0,
    totalAppointments: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState<AppointmentItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDoctorData() {
      try {
        setLoading(true);
        const [statsRes, apptsRes] = await Promise.all([
          fetch("/api/doctor/stats"),
          fetch("/api/doctor/appointments?filter=today"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (isMounted && statsData.stats) {
            setStats(statsData.stats);
          }
        }

        if (apptsRes.ok) {
          const apptsData = await apptsRes.json();
          if (isMounted && Array.isArray(apptsData)) {
            setTodaySchedule(apptsData);
          }
        }
      } catch (err) {
        console.error("Failed to load doctor dashboard data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDoctorData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const pendingCount = todaySchedule.filter(
    (a) => a.status === "in_queue" || a.status === "scheduled"
  ).length;

  const upNext = todaySchedule.find(
    (a) => a.status === "in_progress" || a.status === "in_queue" || a.status === "scheduled"
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatStatus = (status: AppointmentItem["status"]) => {
    switch (status) {
      case "in_progress":
        return { label: "In Consultation", cls: "bg-blue-100 text-blue-700" };
      case "in_queue":
        return { label: "Waiting", cls: "bg-amber-100 text-amber-700" };
      case "scheduled":
        return { label: "Scheduled", cls: "bg-teal-100 text-teal-700" };
      case "completed":
        return { label: "Completed", cls: "bg-emerald-100 text-emerald-700" };
      case "cancelled":
        return { label: "Cancelled", cls: "bg-red-100 text-red-700" };
      default:
        return { label: status, cls: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, Dr. {user?.name || "Doctor"}
        </h1>
        <p className="text-gray-500">Here is what is happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg shadow-teal-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Today&apos;s Appointments</p>
              <p className="text-3xl font-bold mt-1">{stats.todayAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-teal-100">
            <TrendingUp className="w-3 h-3" /> Scheduled for today
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Pending in Queue</p>
              <p className="text-3xl font-bold mt-1">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-emerald-100">
            <Activity className="w-3 h-3" /> Needs consultation
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg shadow-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Patients</p>
              <p className="text-3xl font-bold mt-1">{stats.totalPatients}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-blue-100">
            <TrendingUp className="w-3 h-3" /> {stats.totalAppointments} all-time visits
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Patient */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-500" />
              Up Next
            </h3>
          </div>
          <div className="p-5">
            {upNext ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">
                    {getInitials(upNext.patientName)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{upNext.patientName}</p>
                    <p className="text-sm text-gray-500">
                      {upNext.appointmentTime} • Token #{upNext.tokenNumber || "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Reason: {upNext.notes || "General Consultation"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/doctor/appointments"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20 inline-flex items-center justify-center"
                  >
                    View in Queue
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 text-sm">
                No upcoming patients in queue for today.
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-500" />
              Today&apos;s Schedule
            </h3>
            <Link
              href="/doctor/appointments"
              className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {todaySchedule.slice(0, 5).map((appt) => {
              const statusInfo = formatStatus(appt.status);
              return (
                <div
                  key={appt.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-medium text-gray-500">
                      {appt.appointmentTime}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{appt.patientName}</p>
                      <p className="text-xs text-gray-400">Token #{appt.tokenNumber || "—"}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                </div>
              );
            })}
            {todaySchedule.length === 0 && (
              <div className="p-6 text-center text-gray-400 text-sm">
                No appointments scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
