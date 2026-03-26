"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

type Caregiver = {
  id: string;
  name: string;
  image: string;
  bio: string;
  experience: number;
  hourly_rate: number;
  certifications: string[];
  languages: string[];
  services_offered: string[];
  verification_status: string;
  avg_rating: number;
  total_reviews: number;
  total_bookings: number;
};

export default function CaregiverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
    fetchCaregiver();
  }, [id]);

  const fetchCaregiver = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/caregivers/${id}`);
      const data = await response.json();

      if (response.ok) {
        setCaregiver(data.caregiver);
      } else {
        toast.error("Caregiver not found");
        router.push("/caregivers");
      }
    } catch (error) {
      console.error("Error fetching caregiver:", error);
      toast.error("Failed to load caregiver");
      router.push("/caregivers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading caregiver...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!caregiver) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-slate-500 dark:text-slate-400 hover:text-teal-600"
            >
              Home
            </Link>
            <span className="material-icons text-slate-400 text-sm">
              chevron_right
            </span>
            <Link
              href="/caregivers"
              className="text-slate-500 dark:text-slate-400 hover:text-teal-600"
            >
              Caregivers
            </Link>
            <span className="material-icons text-slate-400 text-sm">
              chevron_right
            </span>
            <span className="text-slate-900 dark:text-white font-medium">
              {caregiver.name}
            </span>
          </div>
        </div>
      </div>

      
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 sticky top-24">
                <div className="text-center mb-6">
                  <img
                    src={
                      caregiver.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(caregiver.name)}&size=200&background=0d9488&color=fff`
                    }
                    alt={caregiver.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-teal-100 object-cover"
                  />
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {caregiver.name}
                  </h1>
                  <p className="text-teal-600 font-semibold mb-4">
                    {caregiver.services_offered.join(", ")}
                  </p>

                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-icons text-sm ${
                            i < Math.floor(caregiver.avg_rating)
                              ? "text-yellow-400"
                              : "text-slate-300"
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {caregiver.avg_rating.toFixed(1)}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                      ({caregiver.total_reviews} reviews)
                    </span>
                  </div>

                  
                  {caregiver.verification_status === "APPROVED" && (
                    <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      <span className="material-icons text-sm">verified</span>
                      Verified Caregiver
                    </div>
                  )}
                </div>

                
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Experience
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {caregiver.experience} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Total Bookings
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {caregiver.total_bookings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Hourly Rate
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      ${caregiver.hourly_rate}
                    </span>
                  </div>
                </div>

                
                <Link
                  href="/services"
                  className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center font-bold py-4 rounded-lg transition-all"
                >
                  Book Now
                </Link>
              </div>
            </div>

            
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  About {caregiver.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {caregiver.bio}
                </p>
              </div>

              
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Services Offered
                </h2>
                <div className="flex flex-wrap gap-3">
                  {caregiver.services_offered.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-semibold"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Certifications &amp; Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {caregiver.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="material-icons text-teal-600">
                        verified
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Languages
                </h2>
                <div className="flex flex-wrap gap-3">
                  {caregiver.languages.map((language, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
