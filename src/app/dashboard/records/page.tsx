"use client";

import { useState, useEffect } from "react";
import {
  FileHeart,
  Plus,
  Trash2,
  X,
  Calendar,
  Stethoscope,
  Building2,
  FileText,
  Syringe,
  Image,
  Pill,
} from "lucide-react";

interface HealthRecord {
  id: number;
  recordType: string;
  title: string;
  description: string | null;
  doctorName: string | null;
  hospitalName: string | null;
  recordDate: string;
  fileUrl: string | null;
}

const recordTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  Prescription: { icon: FileText, color: "bg-blue-100 text-blue-600" },
  "Lab Report": { icon: FileHeart, color: "bg-teal-100 text-teal-600" },
  Vaccination: { icon: Syringe, color: "bg-emerald-100 text-emerald-600" },
  "X-Ray": { icon: Image, color: "bg-purple-100 text-purple-600" },
  "MRI Scan": { icon: Image, color: "bg-indigo-100 text-indigo-600" },
  Surgery: { icon: Stethoscope, color: "bg-red-100 text-red-600" },
  Allergy: { icon: Pill, color: "bg-amber-100 text-amber-600" },
  Other: { icon: FileHeart, color: "bg-gray-100 text-gray-600" },
};

export default function RecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    recordType: "Prescription",
    title: "",
    description: "",
    doctorName: "",
    hospitalName: "",
    recordDate: new Date().toISOString().split("T")[0],
  });

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/health-records");
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecords();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/health-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchRecords();
        setShowForm(false);
        setForm({
          recordType: "Prescription",
          title: "",
          description: "",
          doctorName: "",
          hospitalName: "",
          recordDate: new Date().toISOString().split("T")[0],
        });
      }
    } catch (err) {
      console.error(err);
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/health-records/${id}`, { method: "DELETE" });
      setRecords(records.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const recordTypes = [
    "Prescription", "Lab Report", "Vaccination", "X-Ray",
    "MRI Scan", "Surgery", "Allergy", "Other",
  ];

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Securely manage your digital health profile
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Records */}
      {records.length === 0 ? (
        <div className="text-center py-16">
          <FileHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-500">
            No health records yet
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first health record to start building your digital profile
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors text-sm font-medium"
          >
            Add First Record
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => {
            const config = recordTypeConfig[rec.recordType] || recordTypeConfig.Other;
            const Icon = config.icon;
            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{rec.title}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {rec.recordType}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {rec.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {rec.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(rec.recordDate + 'T00:00:00').toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {rec.doctorName && (
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" />
                          {rec.doctorName}
                        </span>
                      )}
                      {rec.hospitalName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {rec.hospitalName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Record Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add Health Record</h2>
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
                  Record Type *
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  value={form.recordType}
                  onChange={(e) =>
                    setForm({ ...form, recordType: e.target.value })
                  }
                >
                  {recordTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  placeholder="e.g., Annual Health Checkup"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none resize-none"
                  rows={3}
                  placeholder="Add any details about this record..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  placeholder="e.g., Dr. Rajesh Mehta"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital / Clinic
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  placeholder="e.g., Apollo Hospitals"
                  value={form.hospitalName}
                  onChange={(e) =>
                    setForm({ ...form, hospitalName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Record Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  value={form.recordDate}
                  onChange={(e) =>
                    setForm({ ...form, recordDate: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={formLoading || !form.title}
                className="w-full py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50"
              >
                {formLoading ? "Saving..." : "Save Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
