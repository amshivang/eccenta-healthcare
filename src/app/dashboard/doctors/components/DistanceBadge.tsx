"use client";

import { MapPin } from "lucide-react";

interface DistanceBadgeProps {
  distance?: number | null;
  travelTime?: string;
}

export default function DistanceBadge({ distance, travelTime }: DistanceBadgeProps) {
  if (distance == null) return null;

  let colorClass = "bg-green-50 text-green-700 border-green-200";
  let iconClass = "text-green-600";

  if (distance >= 5 && distance <= 15) {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
    iconClass = "text-amber-600";
  } else if (distance > 15) {
    colorClass = "bg-red-50 text-red-700 border-red-200";
    iconClass = "text-red-600";
  }

  return (
    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}>
      <MapPin className={`w-3 h-3 ${iconClass}`} />
      {distance.toFixed(1)} km
      {travelTime && <span className="font-normal opacity-80 ml-1">({travelTime})</span>}
    </span>
  );
}
