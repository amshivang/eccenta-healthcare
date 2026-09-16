"use client";

import { useState } from "react";
import { X, Calendar, Clock, User, FileText, CheckCircle2, ChevronRight, Stethoscope } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  consultationFee: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

export default function BookingModal({ isOpen, onClose, doctor }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    patientName: "",
    age: "",
    gender: "",
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !doctor) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

  const handleNext = () => {
    if (step === 1 && formData.date && formData.time) setStep(2);
    else if (step === 2 && formData.patientName && formData.age && formData.gender) setStep(3);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API Call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(4);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const resetAndClose = () => {
    setStep(1);
    setFormData({ date: "", time: "", patientName: "", age: "", gender: "", reason: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in relative flex flex-col">
        {step !== 4 && (
          <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
              <p className="text-sm text-gray-500 font-medium mt-0.5">Step {step} of 3</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-6">
          {step !== 4 && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-cyan-100 shrink-0">
                <Stethoscope className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 truncate">{doctor.name}</p>
                <p className="text-sm text-cyan-700 font-medium truncate">{doctor.specialization}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-500 font-medium">Fee</p>
                <p className="font-bold text-emerald-600">₹{doctor.consultationFee}</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 text-cyan-600" /> Select Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-medium text-gray-700"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Clock className="w-4 h-4 text-cyan-600" /> Select Time
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormData({ ...formData, time: t })}
                      className={`py-2 rounded-xl text-sm font-bold transition-all ${
                        formData.time === t
                          ? "bg-cyan-600 text-white shadow-md border-cyan-600"
                          : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-cyan-400 hover:bg-cyan-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.date || !formData.time}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-cyan-600" /> Patient Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-cyan-600" /> Reason for Visit
                </label>
                <textarea
                  placeholder="Describe your symptoms or reason..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none resize-none"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.patientName || !formData.age || !formData.gender}
                  className="flex-1 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Review Details <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Appointment Summary</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-500 font-medium">Date & Time</div>
                  <div className="font-bold text-gray-900 text-right">{formData.date} at {formData.time}</div>
                  
                  <div className="text-gray-500 font-medium">Patient</div>
                  <div className="font-bold text-gray-900 text-right">{formData.patientName} ({formData.age} yrs, {formData.gender})</div>
                  
                  <div className="text-gray-500 font-medium">Reason</div>
                  <div className="font-bold text-gray-900 text-right truncate">{formData.reason || "N/A"}</div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between">
                <span className="font-bold text-emerald-800">Total Payable</span>
                <span className="text-xl font-bold text-emerald-600">₹{doctor.consultationFee}</span>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Confirming..." : "Confirm & Pay Later"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-500 mb-6">
                Your appointment with <span className="font-bold text-gray-700">{doctor.name}</span> is confirmed for {formData.date} at {formData.time}.
              </p>
              <button
                onClick={resetAndClose}
                className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
