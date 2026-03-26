"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState<
    "client" | "caregiver" | null
  >(roleParam === "caregiver" ? "caregiver" : null);

  const handleRoleSelect = (role: "client" | "caregiver") => {
    setSelectedRole(role);
    
    setTimeout(() => {
      router.push(`/register/${role}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="material-icons text-white text-xl">
                health_and_safety
              </span>
            </div>
            <span className="text-xl font-bold text-slate-900">Care.io</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="text-sm font-bold text-teal-600 hover:text-teal-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Join Care.io
            </h1>
            <p className="text-xl text-slate-600">
              Choose how you&apos;d like to get started
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => handleRoleSelect("client")}
              className="cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 hover:border-teal-600 p-8 transition-all h-full">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-icons text-blue-600 text-4xl">
                    family_restroom
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  I&apos;m looking for care
                </h2>
                <p className="text-slate-600 mb-6">
                  Find trusted, verified caregivers for your loved ones. Browse
                  profiles, read reviews, and book with confidence.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Browse verified caregivers",
                    "Read reviews and ratings",
                    "Secure online booking",
                    "24/7 customer support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-icons text-teal-600 text-sm">
                          check
                        </span>
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  Get Started as Client
                  <span className="material-icons">arrow_forward</span>
                </button>
              </div>
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              onClick={() => handleRoleSelect("caregiver")}
              className="cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 hover:border-teal-600 p-8 transition-all h-full">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-icons text-teal-600 text-4xl">
                    volunteer_activism
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  I want to provide care
                </h2>
                <p className="text-slate-600 mb-6">
                  Join our community of professional caregivers. Set your own
                  rates, choose your schedule, and connect with families.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Set your own hourly rate",
                    "Flexible scheduling",
                    "Secure payments",
                    "Professional development",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-icons text-teal-600 text-sm">
                          check
                        </span>
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  Get Started as Caregiver
                  <span className="material-icons">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-teal-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-teal-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
