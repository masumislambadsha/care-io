"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NotificationButton from "./NotificationButton";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="material-icons text-white text-2xl">
                health_and_safety
              </span>
            </div>
            <span className="text-xl font-bold text-slate-900">Care.xyz</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              href="/caregivers"
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              Caregivers
            </Link>
            <Link
              href="/about"
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              <>
                {/* Notifications Bell - Reusable Component */}
                <NotificationButton />

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  {/* User Avatar Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 hover:bg-slate-50 rounded-lg p-2 transition-colors"
                  >
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {session.user?.role}
                      </p>
                    </div>
                    <span className="material-icons text-slate-400">
                      {isDropdownOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {session.user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          <span className="material-icons text-xl">
                            dashboard
                          </span>
                          <span className="font-medium">Dashboard</span>
                        </Link>

                        <Link
                          href="/my-bookings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          <span className="material-icons text-xl">
                            event_note
                          </span>
                          <span className="font-medium">My Bookings</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          <span className="material-icons text-xl">person</span>
                          <span className="font-medium">Profile</span>
                        </Link>

                        {session.user?.role === "CAREGIVER" && (
                          <Link
                            href="/caregiver/schedule"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          >
                            <span className="material-icons text-xl">
                              calendar_month
                            </span>
                            <span className="font-medium">My Schedule</span>
                          </Link>
                        )}

                        <Link
                          href="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          <span className="material-icons text-xl">
                            settings
                          </span>
                          <span className="font-medium">Settings</span>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-slate-100 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <span className="material-icons text-xl">logout</span>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-700 hover:text-teal-600 font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
