"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NotificationButton from "@/components/NotificationButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ThemeDebug } from "@/components/shared/ThemeDebug";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isCaregiver = session?.user?.role === "CAREGIVER";

  const clientMenuItems = [
    { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
    { icon: "event_note", label: "My Bookings", href: "/my-bookings" },
    { icon: "receipt_long", label: "Payments", href: "/payments" },
    { icon: "family_restroom", label: "Family Members", href: "/family" },
    { icon: "location_on", label: "Addresses", href: "/addresses" },
    { icon: "search", label: "Find Caregivers", href: "/caregivers" },
    { icon: "medical_services", label: "Services", href: "/services" },
    { icon: "person", label: "Profile", href: "/profile" },
    { icon: "settings", label: "Settings", href: "/settings" },
  ];

  const caregiverMenuItems = [
    { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
    { icon: "work", label: "Assigned Jobs", href: "/caregiver/assigned-jobs" },
    { icon: "event_note", label: "My Bookings", href: "/my-bookings" },
    { icon: "calendar_month", label: "Schedule", href: "/caregiver/schedule" },
    {
      icon: "event_available",
      label: "Availability",
      href: "/caregiver/availability",
    },
    { icon: "payments", label: "Earnings", href: "/caregiver/earnings" },
    { icon: "star", label: "Reviews", href: "/caregiver/reviews" },
    { icon: "person", label: "Profile", href: "/profile" },
    { icon: "settings", label: "Settings", href: "/settings" },
  ];

  const adminMenuItems = [
    { icon: "dashboard", label: "Dashboard", href: "/admin" },
    { icon: "group", label: "Users", href: "/admin/users" },
    { icon: "event_note", label: "Bookings", href: "/admin/bookings" },
    {
      icon: "verified_user",
      label: "Verifications",
      href: "/admin/verifications",
    },
    { icon: "medical_services", label: "Services", href: "/admin/services" },
    { icon: "analytics", label: "Analytics", href: "/admin/analytics" },
    { icon: "settings", label: "Settings", href: "/settings" },
  ];

  const isAdmin = session?.user?.role === "ADMIN";
  const menuItems = isAdmin
    ? adminMenuItems
    : isCaregiver
      ? caregiverMenuItems
      : clientMenuItems;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
          {isSidebarOpen ? (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white text-xl">
                  health_and_safety
                </span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Care.xyz
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="material-icons text-white text-xl">
                health_and_safety
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title={!isSidebarOpen ? item.label : ""}
              >
                <span className="material-icons text-xl">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 p-4">
          <div
            className={`flex items-center gap-3 mb-3 ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-slate-500">{session?.user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all w-full ${
              !isSidebarOpen && "justify-center"
            }`}
            title={!isSidebarOpen ? "Sign Out" : ""}
          >
            <span className="material-icons text-xl">logout</span>
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <span className="material-icons text-slate-600 dark:text-slate-400">
              menu
            </span>
          </button>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationButton />
            <Link
              href="/"
              className="px-4 py-2 lg:-mt-1.5 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-all"
            >
              Back to Home
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 mx-auto max-w-6xl bg-slate-50 dark:bg-slate-950 min-h-screen">
          {children}
        </main>
      </div>

      {/* Theme Debug - Remove in production */}
      <ThemeDebug />
    </div>
  );
}
