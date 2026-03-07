"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterCaregiverPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nid_number: "",
    password: "",
    confirmPassword: "",
    services_offered: [] as string[],
    experience: 0,
    hourly_rate: 15,
    bio: "",
    nid_document_url: "",
    certificate_urls: [] as string[],
    profile_image_url: "",
  });

  const [uploadingNID, setUploadingNID] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const services = [
    "Baby & Child Care",
    "Senior Care",
    "Special Needs Care",
    "Pet Care",
    "Housekeeping",
    "Tutoring",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "CAREGIVER",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      router.push("/login?registered=caregiver");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services_offered: prev.services_offered.includes(service)
        ? prev.services_offered.filter((s) => s !== service)
        : [...prev.services_offered, service],
    }));
  };

  const handleNIDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNID(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "nid");

    try {
      const response = await fetch("/api/upload/document", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, nid_document_url: data.url }));
      } else {
        setError(data.error || "Failed to upload NID document");
      }
    } catch (err) {
      setError("Failed to upload NID document");
    } finally {
      setUploadingNID(false);
    }
  };

  const handleCertificateUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCertificate(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "certificate");

    try {
      const response = await fetch("/api/upload/document", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          certificate_urls: [...prev.certificate_urls, data.url],
        }));
      } else {
        setError(data.error || "Failed to upload certificate");
      }
    } catch (err) {
      setError("Failed to upload certificate");
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfile(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "profile");

    try {
      const response = await fetch("/api/upload/document", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, profile_image_url: data.url }));
      } else {
        setError(data.error || "Failed to upload profile image");
      }
    } catch (err) {
      setError("Failed to upload profile image");
    } finally {
      setUploadingProfile(false);
    }
  };

  const removeCertificate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certificate_urls: prev.certificate_urls.filter((_, i) => i !== index),
    }));
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
            <span className="text-xl font-bold text-slate-900">Care.xyz</span>
          </Link>
        </div>
      </nav>

      <main className="grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <Link
                href="/register"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-4"
              >
                <span className="material-icons text-sm">arrow_back</span>
                Back
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Become a Caregiver
              </h1>
              <p className="text-slate-600">
                Join our community of professional caregivers
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8 flex items-center justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      step >= s
                        ? "bg-teal-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 h-1 ${
                        step > s ? "bg-teal-600" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Personal Information
                  </h2>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 [color-scheme:light]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 [color-scheme:light]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 [color-scheme:light]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      National ID Number *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your NID number"
                      value={formData.nid_number}
                      onChange={(e) =>
                        setFormData({ ...formData, nid_number: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 [color-scheme:light]"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Professional Details
                  </h2>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Services You Offer
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                            formData.services_offered.includes(service)
                              ? "border-teal-600 bg-teal-50 text-teal-700"
                              : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.experience || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience: e.target.value
                            ? parseInt(e.target.value)
                            : 0,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 [color-scheme:light]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.hourly_rate || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hourly_rate: e.target.value
                            ? parseInt(e.target.value)
                            : 15,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 [color-scheme:light]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bio (min 50 characters)
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                      placeholder="Tell families about your experience and approach to caregiving..."
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Security & Documents
                  </h2>

                  {/* Profile Image */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Profile Picture (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      disabled={uploadingProfile}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {uploadingProfile && (
                      <p className="text-sm text-teal-600 mt-2">Uploading...</p>
                    )}
                    {formData.profile_image_url && (
                      <div className="mt-3">
                        <img
                          src={formData.profile_image_url}
                          alt="Profile preview"
                          className="w-24 h-24 object-cover rounded-full border-2 border-teal-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* NID Document */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      NID/National ID Document *
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleNIDUpload}
                      disabled={uploadingNID}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {uploadingNID && (
                      <p className="text-sm text-teal-600 mt-2">Uploading...</p>
                    )}
                    {formData.nid_document_url && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                        <span className="material-icons text-sm">
                          check_circle
                        </span>
                        NID document uploaded successfully
                      </p>
                    )}
                  </div>

                  {/* Certificates */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Certificates (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleCertificateUpload}
                      disabled={uploadingCertificate}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {uploadingCertificate && (
                      <p className="text-sm text-teal-600 mt-2">Uploading...</p>
                    )}
                    {formData.certificate_urls.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {formData.certificate_urls.map((url, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                          >
                            <span className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                              <span className="material-icons text-sm">
                                description
                              </span>
                              Certificate {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCertificate(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <span className="material-icons text-sm">
                                delete
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-5 mt-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <span className="material-icons text-xl">
                              {showPassword ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <span className="material-icons text-xl">
                              {showConfirmPassword
                                ? "visibility_off"
                                : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="ml-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "Create Account"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

