"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, User, Clock, CheckCircle, XCircle, PlayCircle } from "lucide-react";

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
  createdAt: string;
}

export default function DoctorAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"Today" | "Upcoming" | "Past">("Today");
  const [search, setSearch] = useState("");
  const [appointmentsList, setAppointmentsList] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAppointments() {
      try {
        const res = await fetch(`/api/doctor/appointments?filter=${activeTab.toLowerCase()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setAppointmentsList(data);
          }
        }
      } catch (err) {
        if (isMounted) console.error("Failed to fetch appointments:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const updateStatus = async (id: number, newStatus: AppointmentItem["status"]) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointmentsList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update appointment status");
      }
    } catch (err) {
      console.error("Error updating appointment status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = appointmentsList.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.patientName.toLowerCase().includes(q) ||
      (a.notes && a.notes.toLowerCase().includes(q)) ||
      (a.patientPhone && a.patientPhone.includes(q))
    );
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getStatusBadge = (status: AppointmentItem["status"]) => {
    switch (status) {
      case "in_progress":
        return <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">In Consultation</span>;
      case "in_queue":
        return <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">In Queue</span>;
      case "scheduled":
        return <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">Scheduled</span>;
      case "completed":
        return <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">Completed</span>;
      case "cancelled":
        return <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-medium">Cancelled</span>;
      default:
        return <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">Manage your patient consultations and daily schedule.</p>
        </div>

        <div className="flex items-center gap-2">
          {(["Today", "Upcoming", "Past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setLoading(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-500/20"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="text-xs text-gray-500">
            {filtered.length} {filtered.length === 1 ? "appointment" : "appointments"}
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((appt) => (
              <div
                key={appt.id}
                className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    {getInitials(appt.patientName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{appt.patientName}</h3>
                      {getStatusBadge(appt.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" /> {appt.appointmentTime}
                      </span>
                      {activeTab !== "Today" && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" /> {appt.appointmentDate}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-medium text-gray-700">
                        Token #{appt.tokenNumber || "—"}
                      </span>
                      {appt.patientBloodGroup && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                          {appt.patientBloodGroup}
                        </span>
                      )}
                    </div>
                    {appt.notes && (
                      <p className="text-xs text-gray-500 mt-1">
                        Notes: <span className="text-gray-700">{appt.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(appt.status === "scheduled" || appt.status === "in_queue") && (
                    <>
                      <button
                        disabled={updatingId === appt.id}
                        onClick={() => updateStatus(appt.id, "in_progress")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                      >
                        <PlayCircle className="w-4 h-4" /> Call In
                      </button>
                      <button
                        disabled={updatingId === appt.id}
                        onClick={() => updateStatus(appt.id, "cancelled")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  )}

                  {appt.status === "in_progress" && (
                    <button
                      disabled={updatingId === appt.id}
                      onClick={() => updateStatus(appt.id, "completed")}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Complete Consultation
                    </button>
                  )}

                  {appt.status === "completed" && (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Done
                    </span>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-700">No appointments found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {search
                    ? `No results matching "${search}"`
                    : `No ${activeTab.toLowerCase()} appointments scheduled.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
