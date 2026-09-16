"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Hash,
  Stethoscope,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  Users,
} from "lucide-react";

interface Appointment {
  id: number;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  appointmentTime: string;
  tokenNumber: number;
  status: string;
  queuePosition: number;
  estimatedWaitMinutes: number;
  notes: string | null;
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id: number) => {
    try {
      await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      setAppointments(
        appointments.map((a) =>
          a.id === id ? { ...a, status: "cancelled" } : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = appointments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    in_queue: "bg-amber-100 text-amber-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    scheduled: <Clock className="w-4 h-4" />,
    in_queue: <Users className="w-4 h-4" />,
    in_progress: <Loader2 className="w-4 h-4 animate-spin" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "scheduled", "in_queue", "in_progress", "completed", "cancelled"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {f === "all" ? "All" : f.replace("_", " ")}
              {f === "all" && ` (${appointments.length})`}
            </button>
          )
        )}
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-500">No appointments found</p>
          <p className="text-sm text-gray-400 mt-1">
            {filter !== "all"
              ? "Try changing the filter"
              : "Book an appointment from the Doctor Finder"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-7 h-7 text-cyan-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{appt.doctorName}</h3>
                      <p className="text-sm text-cyan-600">{appt.specialization}</p>
                    </div>
                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        statusColors[appt.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusIcons[appt.status]}
                      {appt.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(appt.appointmentDate + 'T00:00:00').toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {appt.appointmentTime?.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Hash className="w-4 h-4 text-gray-400" />
                      Token #{appt.tokenNumber}
                    </span>
                  </div>

                  {appt.status === "scheduled" && appt.estimatedWaitMinutes > 0 && (
                    <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                      <p className="text-xs text-amber-700 font-medium">
                        ⏱ Estimated wait: ~{appt.estimatedWaitMinutes} minutes (Position: #{appt.queuePosition})
                      </p>
                    </div>
                  )}

                  {appt.notes && (
                    <p className="text-xs text-gray-400 mt-2">📝 {appt.notes}</p>
                  )}
                </div>

                {appt.status === "scheduled" && (
                  <button
                    onClick={() => cancelAppointment(appt.id)}
                    className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-medium flex items-center gap-1 self-start"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
