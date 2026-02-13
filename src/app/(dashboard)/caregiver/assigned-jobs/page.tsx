"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Job = {
  id: string;
  booking_number: string;
  service_name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  duration_type: string;
  duration_value: number;
  total_amount: number;
  status: string;
  payment_status: string;
  full_address: string;
};

export default function AssignedJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "CAREGIVER") {
        router.push("/dashboard");
        return;
      }
      fetchAssignedJobs();
    }
  }, [status, router, session]);

  const fetchAssignedJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings/assigned-jobs");
      const data = await response.json();

      if (response.ok) {
        setJobs(data.jobs || []);
        if (data.jobs && data.jobs.length > 0) {
          toast.success(`Loaded ${data.jobs.length} assigned job(s)`);
        }
      } else {
        toast.error("Failed to load assigned jobs");
      }
    } catch (error) {
      console.error("Error fetching assigned jobs:", error);
      toast.error("Failed to load assigned jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/bookings/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: jobId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Job marked as ${newStatus}`);
        fetchAssignedJobs();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assigned jobs...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "ONGOING":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Assigned Jobs
        </h1>
        <p className="text-slate-600">Manage jobs assigned to you by clients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">pending</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-slate-900">
                {jobs.filter((j) => j.status === "CONFIRMED").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-purple-600">
                play_circle
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Ongoing</p>
              <p className="text-2xl font-bold text-slate-900">
                {jobs.filter((j) => j.status === "ONGOING").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-green-600">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-slate-900">
                {jobs.filter((j) => j.status === "COMPLETED").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-teal-600">work</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Jobs</p>
              <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {["all", "confirmed", "ongoing", "completed", "cancelled"].map(
            (filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === filterOption
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Jobs List */}
      {jobs.filter((j) =>
        filter === "all" ? true : j.status.toLowerCase() === filter,
      ).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              work_off
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No assigned jobs
          </h3>
          <p className="text-slate-600">
            Jobs assigned to you by clients will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs
            .filter((j) =>
              filter === "all" ? true : j.status.toLowerCase() === filter,
            )
            .map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {job.service_name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          job.status,
                        )}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Job #{job.booking_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">
                      $
                      {(parseFloat(job.total_amount.toString()) * 0.85).toFixed(
                        2,
                      )}
                    </p>
                    <p className="text-xs text-slate-500">Your earnings</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-slate-400 text-sm">
                      person
                    </span>
                    <div>
                      <p className="text-xs text-slate-500">Client</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {job.client_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="material-icons text-slate-400 text-sm">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-xs text-slate-500">Start Date</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(job.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="material-icons text-slate-400 text-sm">
                      schedule
                    </span>
                    <div>
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {job.duration_value} {job.duration_type.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                  >
                    View Details
                  </button>

                  {job.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleUpdateStatus(job.id, "ONGOING")}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                    >
                      Start Service
                    </button>
                  )}

                  {job.status === "ONGOING" && (
                    <button
                      onClick={() => handleUpdateStatus(job.id, "COMPLETED")}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                    >
                      Complete Service
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Job Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all"
              >
                <span className="material-icons text-slate-600">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    selectedJob.status,
                  )}`}
                >
                  {selectedJob.status}
                </span>
                <span className="text-sm text-slate-600">
                  Job #{selectedJob.booking_number}
                </span>
              </div>

              <div className="bg-teal-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {selectedJob.service_name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Your Earnings</span>
                  <span className="text-2xl font-bold text-teal-600">
                    $
                    {(
                      parseFloat(selectedJob.total_amount.toString()) * 0.85
                    ).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  (85% of ${selectedJob.total_amount} after platform fee)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-teal-600 text-sm">
                      person
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      CLIENT
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {selectedJob.client_name}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-teal-600 text-sm">
                      calendar_today
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      START DATE
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {new Date(selectedJob.start_date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-teal-600 text-sm">
                      schedule
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      DURATION
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {selectedJob.duration_value}{" "}
                    {selectedJob.duration_type.toLowerCase()}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-teal-600 text-sm">
                      payment
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      PAYMENT
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {selectedJob.payment_status}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-icons text-blue-600">
                    location_on
                  </span>
                  <span className="text-xs text-blue-900 font-semibold">
                    SERVICE LOCATION
                  </span>
                </div>
                <p className="text-sm text-blue-900">
                  {selectedJob.full_address || "Address not provided"}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
