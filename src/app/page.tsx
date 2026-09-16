"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Shield,
  Activity,
  Clock,
  MapPin,
  Stethoscope,
  Pill,
  Siren,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "patient",
  });

  // Check if already logged in
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          window.location.href = "/dashboard";
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Full page reload to pick up the httpOnly cookie
      window.location.href = "/dashboard";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const demoLogin = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: "password123" }),
      });
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setError("Demo login failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  const features = [
    { icon: Stethoscope, title: "Doctor Finder", desc: "Search by specialization, rating & availability" },
    { icon: Clock, title: "Smart Queue", desc: "Digital tokens & live queue tracking" },
    { icon: Pill, title: "Medicine Search", desc: "Real-time stock at nearby pharmacies" },
    { icon: Activity, title: "Bed Tracking", desc: "Live hospital bed availability" },
    { icon: Siren, title: "Ambulance", desc: "One-tap emergency ambulance request" },
    { icon: Shield, title: "Health Records", desc: "Secure digital health profile" },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-cyan-600 animate-pulse" />
          </div>
          <p className="text-gray-500 font-medium">Loading EccenTa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Branding & Features */}
      <div className="lg:w-1/2 bg-gradient-to-br from-cyan-700 via-cyan-800 to-sky-900 text-white p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Heart className="w-8 h-8 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">EccenTa</h1>
              <p className="text-cyan-200 text-sm font-medium">Smart Healthcare Ecosystem</p>
            </div>
          </div>

          <p className="text-xl text-cyan-100 mb-10 leading-relaxed max-w-lg">
            One platform connecting patients, doctors, hospitals, pharmacies & emergency services.
            Access every healthcare service you need, instantly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-cyan-200">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-cyan-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Smart City Ready
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> Real-time Sync
            </div>
          </div>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-gray-500 mb-8">
            {isLogin
              ? "Sign in to access your health dashboard"
              : "Join the smart healthcare network"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all bg-white"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all bg-white"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all bg-white pr-12"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all bg-white"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium uppercase tracking-wider">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => demoLogin("patient@eccenta.com")}
                disabled={loading}
                className="px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-200 disabled:opacity-50"
              >
                👤 Patient Demo
              </button>
              <button
                onClick={() => demoLogin("dr.mehta@eccenta.com")}
                disabled={loading}
                className="px-3 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50"
              >
                🩺 Doctor Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
