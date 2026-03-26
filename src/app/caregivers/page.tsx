"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
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
  avg_rating: number;
  total_reviews: number;
  total_bookings: number;
};

export default function CaregiversPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [filteredCaregivers, setFilteredCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    service: "all",
    minRating: 0,
    maxRate: 1000,
    experience: 0,
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
    fetchCaregivers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, caregivers]);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/caregivers");
      const data = await response.json();

      if (response.ok) {
        setCaregivers(data.caregivers);
        setFilteredCaregivers(data.caregivers);
      } else {
        toast.error("Failed to load caregivers");
      }
    } catch (error) {
      console.error("Error fetching caregivers:", error);
      toast.error("Failed to load caregivers");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...caregivers];

    
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.services_offered.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    
    if (filters.service !== "all") {
      filtered = filtered.filter((c) =>
        c.services_offered.includes(filters.service),
      );
    }

    
    if (filters.minRating > 0) {
      filtered = filtered.filter((c) => c.avg_rating >= filters.minRating);
    }

    
    filtered = filtered.filter((c) => c.hourly_rate <= filters.maxRate);

    
    if (filters.experience > 0) {
      filtered = filtered.filter((c) => c.experience >= filters.experience);
    }

    setFilteredCaregivers(filtered);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      service: "all",
      minRating: 0,
      maxRate: 1000,
      experience: 0,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading caregivers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      
      <section className="bg-linear-to-br from-teal-600 to-teal-700 text-white pt-40 -mt-15 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Find Your Caregiver</h1>
            <p className="text-xl text-white/90 mb-8">
              Browse our verified and experienced caregivers
            </p>

            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or service..."
                  className="w-full px-6 py-4 border rounded-2xl border-teal-400 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <span className="material-icons absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Filters
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Service Type
                    </label>
                    <select
                      value={filters.service}
                      onChange={(e) =>
                        setFilters({ ...filters, service: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 dark:text-white dark:bg-slate-700"
                    >
                      <option value="all">All Services</option>
                      <option value="Baby Care">Baby Care</option>
                      <option value="Elderly Care">Elderly Care</option>
                      <option value="Disability Care">Disability Care</option>
                      <option value="Pet Care">Pet Care</option>
                      <option value="Companionship">Companionship</option>
                    </select>
                  </div>

                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Minimum Rating
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={filters.minRating}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minRating: parseFloat(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white w-12">
                        {filters.minRating}+
                      </span>
                    </div>
                  </div>

                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Max Hourly Rate: ${filters.maxRate}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.maxRate}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxRate: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Min Experience: {filters.experience} years
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={filters.experience}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          experience: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Showing {filteredCaregivers.length} of {caregivers.length}{" "}
                  caregivers
                </p>
              </div>

              {filteredCaregivers.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-slate-400 text-4xl">
                      search_off
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    No caregivers found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCaregivers.map((caregiver, index) => (
                    <motion.div
                      key={caregiver.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={
                              caregiver.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(caregiver.name)}&size=80&background=0d9488&color=fff`
                            }
                            alt={caregiver.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-teal-100"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                              {caregiver.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`material-icons text-sm ${
                                      i < Math.floor(caregiver.avg_rating)
                                        ? "text-yellow-400"
                                        : "text-slate-300 dark:text-slate-600"
                                    }`}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {caregiver.avg_rating.toFixed(1)} (
                                {caregiver.total_reviews})
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {caregiver.experience} years experience •{" "}
                              {caregiver.total_bookings} bookings
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {caregiver.bio}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {caregiver.services_offered
                            .slice(0, 3)
                            .map((service) => (
                              <span
                                key={service}
                                className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full"
                              >
                                {service}
                              </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Starting from
                            </p>
                            <p className="text-2xl font-bold text-teal-600">
                              ${caregiver.hourly_rate}
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                /hour
                              </span>
                            </p>
                          </div>
                          <Link
                            href={`/caregivers/${caregiver.id}`}
                            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
