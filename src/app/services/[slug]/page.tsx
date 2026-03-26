"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  image: string;
  base_hourly_rate: number;
  base_daily_rate: number;
  features: string[];
  is_active: boolean;
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
    if (slug) {
      fetchService();
    }
  }, [slug]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services/${slug}`);
      const data = await response.json();

      if (response.ok) {
        setService(data.service);
      } else {
        toast.error("Service not found");
        router.push("/services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to load service");
      router.push("/services");
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
              Loading service...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
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
              href="/services"
              className="text-slate-500 dark:text-slate-400 hover:text-teal-600"
            >
              Services
            </Link>
            <span className="material-icons text-slate-400 text-sm">
              chevron_right
            </span>
            <span className="text-slate-900 dark:text-white font-medium">
              {service.name}
            </span>
          </div>
        </div>
      </div>

      
      <section className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${service.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">{service.name}</h1>
            <p className="text-xl text-white/90 mb-6">
              {service.short_description}
            </p>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-3xl font-bold">
                  ${service.base_hourly_rate}
                </span>
                <span className="text-white/80">/hour</span>
              </div>
              <div className="h-8 w-px bg-white/30"></div>
              <div>
                <span className="text-3xl font-bold">
                  ${service.base_daily_rate}
                </span>
                <span className="text-white/80">/day</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2">
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  About This Service
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  What&apos;s Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="material-icons text-teal-600 mt-0.5">
                        check_circle
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 sticky top-24">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Book This Service
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">
                      Hourly Rate
                    </span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      ${service.base_hourly_rate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">
                      Daily Rate
                    </span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      ${service.base_daily_rate}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/booking/${service.slug}`}
                  className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center font-bold py-4 rounded-lg transition-all mb-4"
                >
                  Book Now
                </Link>

                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-teal-600 text-sm">
                      verified_user
                    </span>
                    <span>Background-checked caregivers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-teal-600 text-sm">
                      schedule
                    </span>
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-teal-600 text-sm">
                      support_agent
                    </span>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Book your first session today and experience quality care
          </p>
          <Link
            href={`/booking/${service.slug}`}
            className="inline-block bg-white text-teal-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-lg transition-all"
          >
            Book {service.name}
          </Link>
        </div>
      </section>
    </div>
  );
}
