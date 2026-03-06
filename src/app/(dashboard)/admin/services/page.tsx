"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  base_hourly_rate: number;
  base_daily_rate: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    } else {
      fetchServices();
    }
  }, [status, session, router]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/services");
      const data = await response.json();
      if (response.ok) {
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        toast.success("Service status updated");
        fetchServices();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Services Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage available care services
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/services/create")}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-icons">add</span>
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {service.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  service.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }`}
              >
                {service.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
              {service.short_description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Hourly Rate:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ৳{service.base_hourly_rate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Daily Rate:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ৳{service.base_daily_rate}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/services/${service.id}`)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => toggleStatus(service.id, service.is_active)}
                className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                {service.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4">
            medical_services
          </span>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No services yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create your first service to get started
          </p>
          <button
            onClick={() => router.push("/admin/services/create")}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span className="material-icons">add</span>
            Add Service
          </button>
        </div>
      )}
    </div>
  );
}
