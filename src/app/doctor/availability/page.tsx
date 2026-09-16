"use client";

import { useState } from "react";
import { Clock, Plus, Save, Trash2, Calendar } from "lucide-react";

export default function DoctorAvailabilityPage() {
  const [schedule, setSchedule] = useState([
    { day: "Monday", active: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
    { day: "Tuesday", active: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
    { day: "Wednesday", active: true, slots: [{ start: "09:00", end: "13:00" }] },
    { day: "Thursday", active: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
    { day: "Friday", active: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "17:00" }] },
    { day: "Saturday", active: false, slots: [] },
    { day: "Sunday", active: false, slots: [] },
  ]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Availability & Schedule</h1>
        <p className="text-gray-500">Configure your standard working hours for appointments.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Weekly Schedule</h2>
              <p className="text-xs text-gray-500">Changes affect future bookings.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        <div className="space-y-4">
          {schedule.map((dayObj, index) => (
            <div key={dayObj.day} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="w-40 flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  checked={dayObj.active}
                  onChange={(e) => {
                    const newSched = [...schedule];
                    newSched[index].active = e.target.checked;
                    if (e.target.checked && newSched[index].slots.length === 0) {
                      newSched[index].slots.push({ start: "09:00", end: "17:00" });
                    }
                    setSchedule(newSched);
                  }}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                />
                <span className={`font-medium ${dayObj.active ? "text-gray-900" : "text-gray-400"}`}>
                  {dayObj.day}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {dayObj.active ? (
                  <>
                    {dayObj.slots.map((slot, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-3">
                        <input
                          type="time"
                          value={slot.start}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                          readOnly
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="time"
                          value={slot.end}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                          readOnly
                        />
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 mt-2">
                      <Plus className="w-4 h-4" /> Add Slot
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 pt-1">Unavailable</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
