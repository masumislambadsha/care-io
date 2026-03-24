"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getViewableUrl } from "@/lib/document-utils";

type PendingCaregiver = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  experience: number;
  hourly_rate: number;
  certifications: string[];
  languages: string[];
  services_offered: string[];
  verification_status: string;
  created_at: string;
  nid_document_url?: string;
  certificate_urls?: string[];
  profile_image_url?: string;
};

export default function AdminVerificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCaregiver, setSelectedCaregiver] =
    useState<PendingCaregiver | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  const {
    data: caregiversData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pending-caregivers"],
    queryFn: async () => {
      const response = await fetch("/api/admin/verifications");
      if (!response.ok) throw new Error("Failed to fetch caregivers");
      return response.json();
    },
    enabled: status === "authenticated" && session?.user?.role === "ADMIN",
  });

  const caregivers: PendingCaregiver[] = caregiversData?.caregivers || [];

  const handleApprove = async (caregiverId: string) => {
    if (!confirm("Are you sure you want to approve this caregiver?")) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/verifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caregiverId,
          action: "approve",
        }),
      });

      if (response.ok) {
        toast.success("Caregiver approved successfully");
        refetch();
        setShowDetailsModal(false);
      } else {
        toast.error("Failed to approve caregiver");
      }
    } catch (error) {
      console.error("Error approving caregiver:", error);
      toast.error("Failed to approve caregiver");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCaregiver || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/verifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caregiverId: selectedCaregiver.user_id,
          action: "reject",
          reason: rejectionReason,
        }),
      });

      if (response.ok) {
        toast.success("Caregiver rejected");
        refetch();
        setShowDetailsModal(false);
        setShowRejectionModal(false);
        setRejectionReason("");
      } else {
        toast.error("Failed to reject caregiver");
      }
    } catch (error) {
      console.error("Error rejecting caregiver:", error);
      toast.error("Failed to reject caregiver");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 mb-2">
          Caregiver Verifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Review and approve caregiver applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
            <div className="w-7 h-7 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-icons text-sm sm:text-2xl text-yellow-600">
                pending
              </span>
            </div>
            <div>
              <p className="text-[10px] sm:text-sm text-slate-600 leading-tight">
                Pending
              </p>
              <p className="text-xs sm:text-2xl font-bold text-slate-900 leading-tight">
                {caregivers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
            <div className="w-7 h-7 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-icons text-sm sm:text-2xl text-green-600">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-[10px] sm:text-sm text-slate-600 leading-tight">
                Approved
              </p>
              <p className="text-xs sm:text-2xl font-bold text-slate-900 leading-tight">
                0
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
            <div className="w-7 h-7 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-icons text-sm sm:text-2xl text-red-600">
                cancel
              </span>
            </div>
            <div>
              <p className="text-[10px] sm:text-sm text-slate-600 leading-tight">
                Rejected
              </p>
              <p className="text-xs sm:text-2xl font-bold text-slate-900 leading-tight">
                0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Caregivers */}
      {caregivers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              verified_user
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No pending verifications
          </h3>
          <p className="text-slate-600">
            All caregiver applications have been reviewed
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {caregivers.map((caregiver) => (
            <div
              key={caregiver.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-teal-600 font-bold text-lg sm:text-2xl">
                    {caregiver.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                  PENDING
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2">
                {caregiver.name}
              </h3>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="material-icons text-xs sm:text-sm shrink-0">
                    email
                  </span>
                  <span className="truncate">{caregiver.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="material-icons text-xs sm:text-sm shrink-0">
                    phone
                  </span>
                  <span>{caregiver.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="material-icons text-xs sm:text-sm shrink-0">
                    work
                  </span>
                  <span>{caregiver.experience} yrs experience</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="material-icons text-xs sm:text-sm shrink-0">
                    attach_money
                  </span>
                  <span>${caregiver.hourly_rate}/hour</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-700 mb-1.5">
                  Services Offered:
                </p>
                <div className="flex flex-wrap gap-1">
                  {caregiver.services_offered
                    .slice(0, 3)
                    .map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  {caregiver.services_offered.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                      +{caregiver.services_offered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCaregiver(caregiver);
                  setShowDetailsModal(true);
                }}
                className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all"
              >
                Review Application
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedCaregiver && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
                Application Review
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all"
              >
                <span className="material-icons text-slate-600">close</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Applicant Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-xl sm:text-3xl">
                    {selectedCaregiver.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-base sm:text-2xl font-bold text-slate-900">
                    {selectedCaregiver.name}
                  </h3>
                  <p className="text-slate-600">{selectedCaregiver.email}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Bio</p>
                <p className="text-slate-900">{selectedCaregiver.bio}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Experience</p>
                  <p className="font-semibold text-slate-900">
                    {selectedCaregiver.experience} years
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Hourly Rate</p>
                  <p className="font-semibold text-slate-900">
                    ${selectedCaregiver.hourly_rate}/hour
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Phone</p>
                  <p className="font-semibold text-slate-900">
                    {selectedCaregiver.phone || "Not provided"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Applied</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(
                      selectedCaregiver.created_at,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Services */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Services Offered
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCaregiver.services_offered.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCaregiver.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Certifications
                </p>
                <div className="space-y-2">
                  {selectedCaregiver.certifications.length > 0 ? (
                    selectedCaregiver.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                      >
                        <span className="material-icons text-green-600">
                          verified
                        </span>
                        <span className="text-green-900 font-medium">
                          {cert}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600">No certifications provided</p>
                  )}
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Uploaded Documents
                </h3>

                {/* Profile Picture */}
                {selectedCaregiver.profile_image_url && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      Profile Picture
                    </p>
                    <img
                      src={getViewableUrl(selectedCaregiver.profile_image_url)}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-teal-600"
                    />
                  </div>
                )}

                {/* NID Document */}
                {selectedCaregiver.nid_document_url && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      NID/National ID Document
                    </p>
                    <a
                      href={getViewableUrl(selectedCaregiver.nid_document_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <span className="material-icons">description</span>
                      View NID Document
                      <span className="material-icons text-sm">
                        open_in_new
                      </span>
                    </a>
                  </div>
                )}

                {/* Certificate Documents */}
                {selectedCaregiver.certificate_urls &&
                  selectedCaregiver.certificate_urls.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        Certificate Documents
                      </p>
                      <div className="space-y-2">
                        {selectedCaregiver.certificate_urls.map((url, idx) => (
                          <a
                            key={idx}
                            href={getViewableUrl(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <span className="material-icons">description</span>
                            Certificate {idx + 1}
                            <span className="material-icons text-sm ml-auto">
                              open_in_new
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {!selectedCaregiver.nid_document_url &&
                  (!selectedCaregiver.certificate_urls ||
                    selectedCaregiver.certificate_urls.length === 0) &&
                  !selectedCaregiver.profile_image_url && (
                    <p className="text-slate-600 text-center py-4">
                      No documents uploaded
                    </p>
                  )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleApprove(selectedCaregiver.user_id)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span className="material-icons">check_circle</span>
                  {isSubmitting ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => setShowRejectionModal(true)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span className="material-icons">cancel</span>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedCaregiver && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-60 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
            <h3 className="text-base sm:text-xl font-bold text-slate-900">
              Reject Application
              </h3>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-slate-600">
                Please provide a reason for rejecting this application. This
                will be sent to the applicant.
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-600 focus:outline-none transition-colors text-slate-900"
                placeholder="Enter rejection reason..."
              ></textarea>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason("");
                  }}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectionReason.trim()}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
