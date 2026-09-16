"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  FileHeart,
  Pill,
  Stethoscope,
  Building2,
  Siren,
  FlaskConical,
  Activity,
  ArrowRight,
  Bell,
  TrendingUp,
} from "lucide-react";

interface DashboardData {
  upcomingAppointments: Array<{
    id: number;
    doctorName: string;
    specialization: string;
    appointmentDate: string;
    appointmentTime: string;
    tokenNumber: number;
    status: string;
    queuePosition: number;
    estimatedWaitMinutes: number;
  }>;
  activeReminders: Array<{
    id: number;
    medicineName: string;
    dosage: string;
    frequency: string;
    reminderTime: string;
  }>;
  recentRecords: Array<{
    id: number;
    recordType: string;
    title: string;
    recordDate: string;
    doctorName: string;
  }>;
  activeLabBookings: Array<{
    id: number;
    testName: string;
    labName: string;
    bookingDate: string;
    status: string;
  }>;
  stats: {
    totalAppointments: number;
    totalRecords: number;
    activeReminders: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard", { credentials: "include" })
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((d) => {
        if (d && d.stats) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { href: "/dashboard/doctors", icon: Stethoscope, label: "Find Doctor", color: "bg-blue-500", lightColor: "bg-blue-50 text-blue-600" },
    { href: "/dashboard/appointments", icon: Calendar, label: "Book Appointment", color: "bg-emerald-500", lightColor: "bg-emerald-50 text-emerald-600" },
    { href: "/dashboard/medicines", icon: Pill, label: "Search Medicine", color: "bg-amber-500", lightColor: "bg-amber-50 text-amber-600" },
    { href: "/dashboard/hospitals", icon: Building2, label: "Hospital Beds", color: "bg-purple-500", lightColor: "bg-purple-50 text-purple-600" },
    { href: "/dashboard/ambulance", icon: Siren, label: "Call Ambulance", color: "bg-red-500", lightColor: "bg-red-50 text-red-600" },
    { href: "/dashboard/labs", icon: FlaskConical, label: "Lab Tests", color: "bg-teal-500", lightColor: "bg-teal-50 text-teal-600" },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalAppointments: 0,
    totalRecords: 0,
    activeReminders: 0,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-2xl p-6 shadow-lg shadow-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Total Appointments</p>
              <p className="text-3xl font-bold mt-1">{stats.totalAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-cyan-100">
            <TrendingUp className="w-3 h-3" /> All time
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Health Records</p>
              <p className="text-3xl font-bold mt-1">{stats.totalRecords}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileHeart className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-emerald-100">
            <Activity className="w-3 h-3" /> Digital records
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg shadow-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Active Reminders</p>
              <p className="text-3xl font-bold mt-1">{stats.activeReminders}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-amber-100">
            <Clock className="w-3 h-3" /> Medicine reminders
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div
                className={`w-12 h-12 ${action.lightColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-500" />
              Upcoming Appointments
            </h3>
            <Link
              href="/dashboard/appointments"
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5">
            {!data?.upcomingAppointments?.length ? (
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No upcoming appointments</p>
                <Link
                  href="/dashboard/doctors"
                  className="text-xs text-cyan-600 hover:underline mt-1 inline-block"
                >
                  Book an appointment →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {appt.doctorName}
                      </p>
                      <p className="text-xs text-gray-500">{appt.specialization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-700">
                        {new Date(appt.appointmentDate + 'T00:00:00').toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                      <p className="text-xs text-gray-400">
                        Token #{appt.tokenNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Medicine Reminders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Medicine Reminders
            </h3>
            <Link
              href="/dashboard/reminders"
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5">
            {!data?.activeReminders?.length ? (
              <div className="text-center py-8">
                <Pill className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No active reminders</p>
                <Link
                  href="/dashboard/reminders"
                  className="text-xs text-cyan-600 hover:underline mt-1 inline-block"
                >
                  Add a reminder →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.activeReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Pill className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {rem.medicineName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {rem.dosage} • {rem.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-amber-600">
                        {rem.reminderTime?.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Health Records */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileHeart className="w-5 h-5 text-emerald-500" />
              Recent Health Records
            </h3>
            <Link
              href="/dashboard/records"
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5">
            {!data?.recentRecords?.length ? (
              <div className="text-center py-8">
                <FileHeart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No health records yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FileHeart className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {rec.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {rec.recordType} • {rec.doctorName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        {rec.recordType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lab Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-500" />
              Active Lab Bookings
            </h3>
            <Link
              href="/dashboard/labs"
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5">
            {!data?.activeLabBookings?.length ? (
              <div className="text-center py-8">
                <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No active lab bookings</p>
                <Link
                  href="/dashboard/labs"
                  className="text-xs text-cyan-600 hover:underline mt-1 inline-block"
                >
                  Book a test →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.activeLabBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <FlaskConical className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {booking.testName}
                      </p>
                      <p className="text-xs text-gray-500">{booking.labName}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      booking.status === "booked"
                        ? "bg-blue-100 text-blue-700"
                        : booking.status === "processing"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {booking.status?.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
