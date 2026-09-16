"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Pill,
  Building2,
  Siren,
  FlaskConical,
  FileHeart,
  Bell,
  Droplets,
  Heart,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  AlertTriangle,
  MapPin,
  Map,
} from "lucide-react";
import { LocationProvider, useGlobalLocation } from "@/context/LocationContext";
import { UserContext, type UserData } from "@/context/UserContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/doctors", icon: Stethoscope, label: "Find Doctors" },
  { href: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { href: "/dashboard/medicines", icon: Pill, label: "Medicine Search" },
  { href: "/dashboard/hospitals", icon: Building2, label: "Hospitals & Beds" },
  { href: "/dashboard/ambulance", icon: Siren, label: "Ambulance" },
  { href: "/dashboard/labs", icon: FlaskConical, label: "Lab Services" },
  { href: "/dashboard/records", icon: FileHeart, label: "Health Records" },
  { href: "/dashboard/reminders", icon: Bell, label: "Reminders" },
  { href: "/dashboard/blood-banks", icon: Droplets, label: "Blood Banks" },
  { href: "/dashboard/emergency", icon: AlertTriangle, label: "Emergency SOS" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocationProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </LocationProvider>
  );
}

function LocationBanner() {
  const { location, address, error, loading, permissionGranted, requestLocation } = useGlobalLocation();

  if (loading) {
    return (
      <div className="bg-cyan-50 border-b border-cyan-100 px-4 lg:px-8 py-2 flex items-center gap-2">
        <div className="w-4 h-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <span className="text-sm text-cyan-700">Detecting your location...</span>
      </div>
    );
  }

  if (permissionGranted === false || error) {
    return (
      <div className="bg-amber-50 border-b border-amber-100 px-4 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-800">Location permission denied. Showing default results.</span>
        </div>
        <button onClick={requestLocation} className="text-sm text-amber-700 font-medium hover:text-amber-900 underline">
          Retry
        </button>
      </div>
    );
  }

  if (location && permissionGranted) {
    return (
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-800">
            {address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
          </span>
          <span className="text-xs text-emerald-600 ml-2 hidden sm:inline">(Showing nearby healthcare services)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sky-50 border-b border-sky-100 px-4 lg:px-8 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Map className="w-4 h-4 text-sky-600" />
        <span className="text-sm text-sky-800">Enable location services for better recommendations.</span>
      </div>
      <button onClick={requestLocation} className="text-sm bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded-md transition-colors shadow-sm">
        Allow Location
      </button>
    </div>
  );
}

function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setAuthFailed(false);
      } else {
        setAuthFailed(true);
      }
    } catch {
      setAuthFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser();
  }, [refreshUser]);

  // Redirect to login if auth failed (use window.location for full reload)
  useEffect(() => {
    if (!loading && authFailed) {
      window.location.href = "/";
    }
  }, [loading, authFailed]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  };

  if (loading || authFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-cyan-600 animate-pulse" />
          </div>
          <p className="text-gray-500 font-medium">
            {authFailed ? "Redirecting to login..." : "Loading EccenTa..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, refreshUser }}>
      <div className="min-h-screen flex bg-gray-50">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-sky-900 via-cyan-900 to-cyan-950 text-white flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">EccenTa</h1>
                  <p className="text-[10px] text-cyan-300 uppercase tracking-widest">Healthcare</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/10"
                      : "text-cyan-100/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive ? "text-cyan-300" : "text-cyan-400/50 group-hover:text-cyan-300"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-cyan-300" />}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-cyan-300 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-800"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-dot" />
                  <span className="text-xs font-medium text-emerald-700">System Online</span>
                </div>
              </div>
            </div>
          </header>

          <LocationBanner />

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  );
}
