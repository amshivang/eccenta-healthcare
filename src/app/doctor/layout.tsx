"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  Settings,
  Heart,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react";

import { UserContext, type UserData } from "@/context/UserContext";

const navItems = [
  { href: "/doctor", icon: LayoutDashboard, label: "Overview" },
  { href: "/doctor/appointments", icon: Calendar, label: "Appointments" },
  { href: "/doctor/availability", icon: Clock, label: "Availability" },
];

export default function DoctorLayout({
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
      if (data.user && data.user.role === "DOCTOR") {
        setUser(data.user);
        setAuthFailed(false);
      } else {
        setAuthFailed(true);
      }
    } catch {
      setAuthFailed(true);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        if (data.user && data.user.role === "DOCTOR") {
          setUser(data.user);
          setAuthFailed(false);
        } else {
          setAuthFailed(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (ignore) return;
        setAuthFailed(true);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

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
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-teal-600 animate-pulse" />
          </div>
          <p className="text-gray-500 font-medium">
            {authFailed ? "Redirecting..." : "Loading Workspace..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, refreshUser }}>
      <div className="min-h-screen flex bg-gray-50">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-teal-900 via-teal-800 to-teal-950 text-white flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <StethoscopeIcon className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">EccenTa</h1>
                  <p className="text-[10px] text-teal-300 uppercase tracking-widest">Doctor Portal</p>
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
                      ? "bg-teal-500/20 text-white shadow-lg shadow-teal-500/10"
                      : "text-teal-100/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive ? "text-teal-300" : "text-teal-400/50 group-hover:text-teal-300"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-teal-300" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-teal-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Dr. {user?.name}</p>
                <p className="text-xs text-teal-300 capitalize">{user?.role}</p>
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
                    {navItems.find((n) => n.href === pathname)?.label || "Doctor Portal"}
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
                  <span className="text-xs font-medium text-emerald-700">Accepting Patients</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  );
}

function StethoscopeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}
