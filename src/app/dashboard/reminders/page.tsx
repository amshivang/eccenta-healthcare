"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  X,
  Clock,
  Pill,
  ToggleLeft,
  ToggleRight,
  Calendar,
} from "lucide-react";

interface Reminder {
  id: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  reminderTime: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    medicineName: "",
    dosage: "",
    frequency: "Once daily",
    reminderTime: "08:00",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  const fetchReminders = async () => {
    try {
      const res = await fetch("/api/reminders");
      const data = await res.json();
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReminders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          reminderTime: form.reminderTime + ":00",
          endDate: form.endDate || null,
        }),
      });
      if (res.ok) {
        await fetchReminders();
        setShowForm(false);
        setForm({
          medicineName: "",
          dosage: "",
          frequency: "Once daily",
          reminderTime: "08:00",
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
    setFormLoading(false);
  };

  const toggleReminder = async (id: number, isActive: boolean) => {
    try {
      await fetch(`/api/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      setReminders(
        reminders.map((r) =>
          r.id === id ? { ...r, isActive: !r.isActive } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReminder = async (id: number) => {
    try {
      await fetch(`/api/reminders/${id}`, { method: "DELETE" });
      setReminders(reminders.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Once daily (Morning)",
    "Once daily (Night)",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Weekly",
    "As needed",
  ];

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Never miss a dose with smart reminders
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Add Reminder
        </button>
      </div>

      {/* Reminders */}
      {reminders.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-500">No reminders set</p>
          <p className="text-sm text-gray-400 mt-1">
            Add medicine reminders to stay on track
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors text-sm font-medium"
          >
            Add First Reminder
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                rem.isActive
                  ? "border-gray-100 hover:shadow-md"
                  : "border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    rem.isActive
                      ? "bg-amber-100 text-amber-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Pill className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{rem.medicineName}</h3>
                  <p className="text-sm text-gray-500">
                    {rem.dosage} • {rem.frequency}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {rem.reminderTime?.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      From {new Date(rem.startDate + 'T00:00:00').toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {rem.endDate &&
                        ` to ${new Date(rem.endDate + 'T00:00:00').toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReminder(rem.id, rem.isActive)}
                    className={`p-1 transition-colors ${
                      rem.isActive ? "text-emerald-500" : "text-gray-400"
                    }`}
                    title={rem.isActive ? "Disable" : "Enable"}
                  >
                    {rem.isActive ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add Medicine Reminder</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  placeholder="e.g., Metformin 500mg"
                  value={form.medicineName}
                  onChange={(e) =>
                    setForm({ ...form, medicineName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  placeholder="e.g., 1 tablet"
                  value={form.dosage}
                  onChange={(e) =>
                    setForm({ ...form, dosage: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  value={form.frequency}
                  onChange={(e) =>
                    setForm({ ...form, frequency: e.target.value })
                  }
                >
                  {frequencies.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  value={form.reminderTime}
                  onChange={(e) =>
                    setForm({ ...form, reminderTime: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  formLoading || !form.medicineName || !form.dosage
                }
                className="w-full py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50"
              >
                {formLoading ? "Adding..." : "Add Reminder"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
