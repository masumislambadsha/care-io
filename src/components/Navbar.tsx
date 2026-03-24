"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import NotificationButton from "./NotificationButton";
import BurgerCheckbox from "./BurgerCheckbox";
import { ThemeToggle } from "./shared/ThemeToggle";
import profile from "../../public/profile.png"

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/caregivers", label: "Caregivers" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success("Signed out successfully");
    router.push("/");
  };

  const dashboardHref =
    session?.user?.role === "ADMIN"
      ? "/admin"
      : session?.user?.role === "CAREGIVER"
        ? "/caregiver/schedule"
        : "/dashboard";

        const noProfileImg = profile
  return (
    <>
      <nav className="base backdrop-blur-3xl border-b border-slate-200 dark:border-slate-700 fixed w-full top-0 z-50 shadow-sm ">
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
              <span className="text-xl font-bold text-white">
                Care.xyz
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              ) : session ? (
                <>
                  <NotificationButton />
                  <ThemeToggle />
                  {/* User Dropdown */}
                  <div className="relative hidden md:block" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors"
                    >
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">

                        {session.user?.image ? (
                          <Image
                            src={session.user.image || noProfileImg}
                            alt={session.user.name || "User"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          session.user?.name?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-[#f5f5f5]">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {session.user?.role}
                        </p>
                      </div>
                      <span className="material-icons text-slate-400">
                        {isDropdownOpen ? "expand_less" : "expand_more"}
                      </span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {session.user?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                          >
                            <span className="material-icons text-xl">
                              dashboard
                            </span>
                            <span className="font-medium">Dashboard</span>
                          </Link>
                          <Link
                            href="/my-bookings"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                          >
                            <span className="material-icons text-xl">
                              event_note
                            </span>
                            <span className="font-medium">My Bookings</span>
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                          >
                            <span className="material-icons text-xl">
                              person
                            </span>
                            <span className="font-medium">Profile</span>
                          </Link>
                          {session.user?.role === "CAREGIVER" && (
                            <Link
                              href="/caregiver/schedule"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
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
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                          >
                            <span className="material-icons text-xl">
                              settings
                            </span>
                            <span className="font-medium">Settings</span>
                          </Link>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                          >
                            <span className="material-icons text-xl">
                              logout
                            </span>
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <ThemeToggle />
                  <Link
                    href="/login"
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition-colors"
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

              {/* Burger — mobile only */}
              <div className="md:hidden">
                <BurgerCheckbox checked={mobileOpen} onChange={setMobileOpen} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu — full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            className="md:hidden fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] z-50 bg-white dark:bg-slate-900 flex flex-col px-6 pt-6 pb-10 overflow-y-auto"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                type: "spring" as const,
                stiffness: 320,
                damping: 32,
              },
            }}
            exit={{
              y: "-100%",
              opacity: 0,
              transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 400,
                    damping: 30,
                    delay: 0.05 + i * 0.06,
                  }}
                >
                  <Link
                    href={href}
                    className="block py-2 text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring" as const,
                stiffness: 300,
                damping: 28,
                delay: 0.38,
              }}
            >
              {session ? (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold overflow-hidden">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        session.user?.name?.[0]?.toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link
                      href={dashboardHref}
                      className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      My Profile
                    </Link>
                    {session.user?.role === "CAREGIVER" && (
                      <Link
                        href="/caregiver/schedule"
                        className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        My Schedule
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                      className="mt-2 py-2 text-sm font-medium text-red-500 text-left"
                    >
                      Sign out
                    </button>
                    <div className="pt-2">
                      <ThemeToggle />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="py-3 text-center text-sm font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="py-3 text-center text-sm font-semibold bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-600/20 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </Link>
                  <div className="flex justify-center pt-2">
                    <ThemeToggle />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
