"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addressSchema = z.object({
  label: z.string().min(2, "Label must be at least 2 characters"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  is_default: z.boolean().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

type Address = {
  id: string;
  label: string;
  division: string;
  district: string;
  city: string;
  area: string;
  address: string;
  is_default: boolean;
};

const divisions = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const districtsByDivision: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj"],
  Chittagong: ["Chittagong", "Cox's Bazar", "Comilla", "Feni", "Noakhali"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Sirajganj", "Natore"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Kushtia"],
  Barisal: ["Barisal", "Patuakhali", "Bhola", "Pirojpur", "Jhalokati"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Lalmonirhat", "Nilphamari"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

const citiesByDistrict: Record<string, string[]> = {
  Dhaka: ["Dhaka City", "Savar", "Keraniganj", "Dhamrai"],
  Gazipur: ["Gazipur City", "Tongi", "Kaliakair"],
  Chittagong: ["Chittagong City", "Hathazari", "Rangunia"],
  Rajshahi: ["Rajshahi City", "Paba", "Godagari"],
};

const areasByCity: Record<string, string[]> = {
  "Dhaka City": [
    "Dhanmondi",
    "Gulshan",
    "Banani",
    "Mirpur",
    "Uttara",
    "Mohammadpur",
    "Bashundhara",
  ],
  "Chittagong City": ["Agrabad", "Panchlaish", "Khulshi", "Halishahar"],
  "Rajshahi City": ["Shaheb Bazar", "Boalia", "Motihar"],
};

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const watchDivision = watch("division");
  const watchDistrict = watch("district");
  const watchCity = watch("city");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status, router]);

  useEffect(() => {
    if (watchDivision) {
      setSelectedDivision(watchDivision);
      setValue("district", "");
      setValue("city", "");
      setValue("area", "");
    }
  }, [watchDivision, setValue]);

  useEffect(() => {
    if (watchDistrict) {
      setSelectedDistrict(watchDistrict);
      setValue("city", "");
      setValue("area", "");
    }
  }, [watchDistrict, setValue]);

  useEffect(() => {
    if (watchCity) {
      setSelectedCity(watchCity);
      setValue("area", "");
    }
  }, [watchCity, setValue]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/addresses");
      const data = await response.json();

      if (response.ok) {
        setAddresses(data.addresses || []);
      } else {
        toast.error("Failed to load addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    reset({
      label: "",
      division: "",
      district: "",
      city: "",
      area: "",
      address: "",
      is_default: false,
    });
    setSelectedDivision("");
    setSelectedDistrict("");
  };

  const onSubmit = async (data: AddressForm) => {
    try {
      setIsSubmitting(true);

      const url = editingAddress
        ? `/api/addresses?id=${editingAddress.id}`
        : "/api/addresses";
      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          editingAddress
            ? "Address updated successfully"
            : "Address added successfully",
        );
        setShowModal(false);
        fetchAddresses();
        reset();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses?id=${addressId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_default: true }),
      });

      if (response.ok) {
        toast.success("Default address updated");
        fetchAddresses();
      } else {
        toast.error("Failed to set default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses?id=${addressId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Address deleted");
        fetchAddresses();
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  const availableDistricts = selectedDivision
    ? districtsByDivision[selectedDivision] || []
    : [];
  const availableCities = selectedDistrict
    ? citiesByDistrict[selectedDistrict] || []
    : [];
  const availableAreas = selectedCity ? areasByCity[selectedCity] || [] : [];

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Saved Addresses
          </h1>
          <p className="text-slate-600">
            Manage your addresses for faster booking
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <span className="material-icons">add</span>
          Add Address
        </button>
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              location_on
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No saved addresses yet
          </h3>
          <p className="text-slate-600 mb-6">
            Add addresses to make booking faster
          </p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all inline-flex items-center gap-2"
          >
            <span className="material-icons">add</span>
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all ${
                address.is_default
                  ? "border-teal-600 bg-teal-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-teal-600">
                      location_on
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {address.label}
                    </h3>
                    {address.is_default && (
                      <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(address)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span className="material-icons text-slate-600 text-xl">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="material-icons text-red-600 text-xl">
                      delete
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-slate-700">{address.address}</p>
                <p className="text-sm text-slate-600">
                  {address.area}, {address.city}
                </p>
                <p className="text-sm text-slate-600">
                  {address.district}, {address.division}
                </p>
              </div>

              {!address.is_default && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="w-full px-4 py-2 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-600 hover:text-white transition-all"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all"
              >
                <span className="material-icons text-slate-600">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Label */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Label *
                </label>
                <input
                  type="text"
                  {...register("label")}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
                  placeholder="e.g., Home, Office, Parents House"
                />
                {errors.label && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.label.message}
                  </p>
                )}
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Division *
                </label>
                <select
                  {...register("division")}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
                >
                  <option value="">Select Division</option>
                  {divisions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
                {errors.division && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.division.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  District *
                </label>
                <select
                  {...register("district")}
                  disabled={!selectedDivision}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900 disabled:bg-slate-100"
                >
                  <option value="">Select District</option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City *
                </label>
                <select
                  {...register("city")}
                  disabled={!selectedDistrict}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900 disabled:bg-slate-100"
                >
                  <option value="">Select City</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Area *
                </label>
                <select
                  {...register("area")}
                  disabled={!selectedCity}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900 disabled:bg-slate-100"
                >
                  <option value="">Select Area</option>
                  {availableAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {errors.area && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.area.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Detailed Address *
                </label>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
                  placeholder="House/Flat number, Road, Block, etc."
                ></textarea>
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Default Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("is_default")}
                  id="is_default"
                  className="w-5 h-5 text-teal-600 border-2 border-slate-300 rounded focus:ring-teal-600"
                />
                <label
                  htmlFor="is_default"
                  className="text-sm font-semibold text-slate-700"
                >
                  Set as default address
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingAddress
                      ? "Update Address"
                      : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
