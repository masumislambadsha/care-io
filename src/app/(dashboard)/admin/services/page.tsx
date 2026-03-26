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
  image?: string;
  created_at: string;
}

export default function AdminServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    base_hourly_rate: 25,
    base_daily_rate: 150,
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      
      const response = await fetch("/api/services?admin=true");
      const data = await response.json();
      if (response.ok) {
        setServices(data.services || []);
      } else {
        toast.error("Failed to load services");
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

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Service created successfully");
        setShowCreateModal(false);
        setFormData({
          name: "",
          slug: "",
          description: "",
          short_description: "",
          base_hourly_rate: 25,
          base_daily_rate: 150,
          image: "",
        });
        fetchServices();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create service");
      }
    } catch (error) {
      toast.error("Failed to create service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/services/${editingService.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Service updated successfully");
        setShowEditModal(false);
        setEditingService(null);
        setFormData({
          name: "",
          slug: "",
          description: "",
          short_description: "",
          base_hourly_rate: 25,
          base_daily_rate: 150,
          image: "",
        });
        fetchServices();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update service");
      }
    } catch (error) {
      toast.error("Failed to update service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description,
      short_description: service.short_description,
      base_hourly_rate: service.base_hourly_rate,
      base_daily_rate: service.base_daily_rate,
      image: service.image || "",
    });
    setShowEditModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
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
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-8">
        <div>
          <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
            Services Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Manage available care services
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-icons">add</span>
          Add Service
        </button>
      </div>

      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex gap-2 sm:gap-3">
          {(["all", "active", "inactive"] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                filter === filterOption
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {services
          .filter((service) => {
            if (filter === "all") return true;
            if (filter === "active") return service.is_active;
            if (filter === "inactive") return !service.is_active;
            return true;
          })
          .map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-3 sm:p-6">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
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
                      ${service.base_hourly_rate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Daily Rate:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${service.base_daily_rate}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(service)}
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
            </div>
          ))}
      </div>

      {services.filter((service) => {
        if (filter === "all") return true;
        if (filter === "active") return service.is_active;
        if (filter === "inactive") return !service.is_active;
        return true;
      }).length === 0 && (
        <div className="text-center py-12">
          <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 dark:text-slate-400 mb-4">
            medical_services
          </span>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {filter === "all" ? "No services yet" : `No ${filter} services`}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {filter === "all"
              ? "Create your first service to get started"
              : `No services are currently ${filter}`}
          </p>
          {filter === "all" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <span className="material-icons">add</span>
              Add Service
            </button>
          )}
        </div>
      )}

      
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full my-8 flex flex-col max-h-[calc(100vh-4rem)]">
            <div className="shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Create New Service
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <span className="material-icons text-slate-600 dark:text-slate-400">
                  close
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: name.toLowerCase().replace(/\s+/g, "-"),
                    });
                  }}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                  placeholder="e.g., Baby & Child Care"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Slug (auto-generated)
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                  placeholder="baby-child-care"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                  placeholder="Brief description (max 100 characters)"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white resize-none"
                  placeholder="Detailed description of the service"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Service Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900 dark:file:text-teal-200"
                />
                {uploadingImage && (
                  <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">
                    Uploading image...
                  </p>
                )}
                {formData.image && !uploadingImage && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Service preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Hourly Rate ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.base_hourly_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        base_hourly_rate: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Daily Rate ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.base_daily_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        base_daily_rate: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-white dark:bg-slate-800 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:border-slate-300 dark:hover:border-slate-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleCreateService}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {showEditModal && editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full my-8 flex flex-col max-h-[calc(100vh-4rem)]">
            <div className="shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Edit Service
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingService(null);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <span className="material-icons text-slate-600 dark:text-slate-400">
                  close
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: name.toLowerCase().replace(/\s+/g, "-"),
                    });
                  }}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Service Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900 dark:file:text-teal-200"
                />
                {uploadingImage && (
                  <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">
                    Uploading image...
                  </p>
                )}
                {formData.image && !uploadingImage && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Service preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Hourly Rate (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.base_hourly_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        base_hourly_rate: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Daily Rate (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.base_daily_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        base_daily_rate: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-white dark:bg-slate-800 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingService(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:border-slate-300 dark:hover:border-slate-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleEditService}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
