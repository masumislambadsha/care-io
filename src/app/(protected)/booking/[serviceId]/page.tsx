"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { PromoCodeInput } from "@/components/booking/PromoCodeInput";

type Step = 1 | 2 | 3 | 4;

type Caregiver = {
  id: string;
  name: string;
  image: string;
  avg_rating: number;
  total_reviews: number;
  hourly_rate: number;
  experience: number;
  certifications: string[];
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const serviceId = params.serviceId as string;

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [bookingData, setBookingData] = useState({
    serviceId: serviceId,
    caregiverId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    durationType: "HOURLY" as "HOURLY" | "DAILY" | "WEEKLY",
    durationValue: 1,
    division: "",
    district: "",
    city: "",
    area: "",
    address: "",
    specialInstructions: "",
  });

  // Fetch caregivers
  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoadingCaregivers(true);
      const response = await fetch("/api/caregivers");
      const data = await response.json();

      if (response.ok) {
        setCaregivers(data.caregivers || []);
      } else {
        toast.error("Failed to load caregivers");
      }
    } catch (error) {
      console.error("Error fetching caregivers:", error);
      toast.error("Failed to load caregivers");
    } finally {
      setLoadingCaregivers(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/booking/${serviceId}`);
    }
  }, [status, router, serviceId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Choose Caregiver" },
    { number: 2, title: "Schedule" },
    { number: 3, title: "Location" },
    { number: 4, title: "Review & Pay" },
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Calculate amounts
      const baseAmount = 25 * bookingData.durationValue;
      const platformFee = baseAmount * 0.1;
      const totalAmount = baseAmount + platformFee - promoDiscount;

      // Combine date and time
      const startDateTime = `${bookingData.startDate}T${bookingData.startTime}`;

      // Store booking data in session storage for success page
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          ...bookingData,
          startDate: startDateTime,
          baseAmount,
          platformFee,
          discount: promoDiscount,
          totalAmount,
          promoCode: promoCode || null,
        }),
      );

      toast.loading("Creating checkout session...");

      // Create checkout session
      const response = await fetch("/api/bookings/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingData,
          startDate: startDateTime,
          baseAmount,
          platformFee,
          discount: promoDiscount,
          totalAmount,
          promoCode: promoCode || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout URL directly
      if (data.url) {
        toast.dismiss();
        toast.success("Redirecting to payment...");
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: unknown) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process payment. Please try again.";
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />

      {/* Progress Steps */}
      <div className="bg-white border-b border-slate-200 py-5 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep >= step.number
                        ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <span className="material-icons text-sm">check</span>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`hidden sm:block mt-2 text-xs font-semibold whitespace-nowrap ${
                      currentStep >= step.number
                        ? "text-teal-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-all ${
                      currentStep > step.number ? "bg-teal-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="sm:hidden text-center text-sm font-semibold text-teal-600 mt-3">
            Step {currentStep} of {steps.length} —{" "}
            {steps[currentStep - 1].title}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-6">
                Choose Your Caregiver
              </h2>
              <p className="text-slate-600 mb-5 sm:mb-8">
                Select a caregiver for this service
              </p>

              {/* Caregiver Cards */}
              <div className="space-y-4">
                {loadingCaregivers ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading caregivers...</p>
                  </div>
                ) : caregivers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600">
                      No caregivers available at the moment
                    </p>
                  </div>
                ) : (
                  caregivers.map((caregiver) => (
                    <div
                      key={caregiver.id}
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          caregiverId: caregiver.id,
                        })
                      }
                      className={`border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:shadow-lg ${
                        bookingData.caregiverId === caregiver.id
                          ? "border-teal-600 bg-teal-50"
                          : "border-slate-200 hover:border-teal-300"
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-6">
                        {/* Avatar */}
                        <img
                          src={
                            caregiver.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(caregiver.name)}&size=96&background=0d9488&color=fff`
                          }
                          alt={caregiver.name}
                          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="min-w-0">
                              <h3 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                                {caregiver.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-600">
                                {caregiver.experience} years experience
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg sm:text-2xl font-bold text-teal-600">
                                ${caregiver.hourly_rate}
                                <span className="text-xs sm:text-sm text-slate-500">
                                  /hr
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`material-icons text-xs sm:text-sm ${
                                    i < Math.floor(caregiver.avg_rating)
                                      ? "text-yellow-400"
                                      : "text-slate-300"
                                  }`}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">
                              {caregiver.avg_rating.toFixed(1)}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-500">
                              ({caregiver.total_reviews} reviews)
                            </span>
                          </div>

                          {/* Certifications */}
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {caregiver.certifications
                              .slice(0, 3)
                              .map((cert, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 sm:px-3 py-0.5 sm:py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full"
                                >
                                  {cert}
                                </span>
                              ))}
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        <div className="flex items-center flex-shrink-0">
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                              bookingData.caregiverId === caregiver.id
                                ? "border-teal-600 bg-teal-600"
                                : "border-slate-300"
                            }`}
                          >
                            {bookingData.caregiverId === caregiver.id && (
                              <span className="material-icons text-white text-xs sm:text-sm">
                                check
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-6 break-words">
                Schedule Your Service
              </h2>
              <p className="text-slate-600 mb-5 sm:mb-8 text-sm sm:text-base">
                Choose date, time, and duration
              </p>

              <div className="space-y-6">
                {/* Duration Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Duration Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(["HOURLY", "DAILY", "WEEKLY"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setBookingData({ ...bookingData, durationType: type })
                        }
                        className={`p-4 border-2 rounded-xl font-semibold transition-all ${
                          bookingData.durationType === type
                            ? "border-teal-600 bg-teal-50 text-teal-700"
                            : "border-slate-200 text-slate-700 hover:border-teal-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 z-10 pointer-events-none">
                        calendar_today
                      </span>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            startDate: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 pl-11 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 cursor-pointer"
                        style={{ colorScheme: "light" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Start Time
                    </label>
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 z-10 pointer-events-none">
                        schedule
                      </span>
                      <input
                        type="time"
                        value={bookingData.startTime}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            startTime: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 pl-11 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 cursor-pointer"
                        style={{ colorScheme: "light" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Duration Value */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration (
                    {bookingData.durationType === "HOURLY"
                      ? "hours"
                      : bookingData.durationType === "DAILY"
                        ? "days"
                        : "weeks"}
                    )
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          durationValue: Math.max(
                            1,
                            bookingData.durationValue - 1,
                          ),
                        })
                      }
                      className="sm:w-12 w-10 sm:h-12 h-10 flex items-center justify-center border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all"
                    >
                      <span className="material-icons text-slate-700">
                        remove
                      </span>
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={bookingData.durationValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || parseInt(value) >= 1) {
                          setBookingData({
                            ...bookingData,
                            durationValue: value === "" ? 1 : parseInt(value),
                          });
                        }
                      }}
                      className="sm:px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 text-center text-xs sm:text-xl font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          durationValue: bookingData.durationValue + 1,
                        })
                      }
                      className="sm:w-12 w-10 sm:h-12 h-10 flex items-center justify-center border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all"
                    >
                      <span className="material-icons text-slate-700">add</span>
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-teal-700">
                    <span className="material-icons">info</span>
                    <span className="font-semibold">
                      Service will be provided for {bookingData.durationValue}{" "}
                      {bookingData.durationType === "HOURLY"
                        ? bookingData.durationValue === 1
                          ? "hour"
                          : "hours"
                        : bookingData.durationType === "DAILY"
                          ? bookingData.durationValue === 1
                            ? "day"
                            : "days"
                          : bookingData.durationValue === 1
                            ? "week"
                            : "weeks"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-6">
                Service Location
              </h2>
              <p className="text-slate-600 mb-5 sm:mb-8">
                Where should the caregiver provide service?
              </p>

              <div className="space-y-6">
                {/* Division */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Division
                  </label>
                  <select
                    value={bookingData.division}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        division: e.target.value,
                        district: "",
                        city: "",
                        area: "",
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900"
                  >
                    <option value="">Select Division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                {/* District */}
                {bookingData.division && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      District
                    </label>
                    <select
                      value={bookingData.district}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          district: e.target.value,
                          city: "",
                          area: "",
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900"
                    >
                      <option value="">Select District</option>
                      {bookingData.division === "Dhaka" && (
                        <>
                          <option value="Dhaka">Dhaka</option>
                          <option value="Gazipur">Gazipur</option>
                          <option value="Narayanganj">Narayanganj</option>
                          <option value="Tangail">Tangail</option>
                        </>
                      )}
                      {bookingData.division === "Chittagong" && (
                        <>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Cox's Bazar">Cox's Bazar</option>
                          <option value="Comilla">Comilla</option>
                        </>
                      )}
                      {/* Add more districts for other divisions as needed */}
                    </select>
                  </div>
                )}

                {/* City */}
                {bookingData.district && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City/Upazila
                    </label>
                    <input
                      type="text"
                      value={bookingData.city}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, city: e.target.value })
                      }
                      placeholder="Enter city or upazila"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900"
                    />
                  </div>
                )}

                {/* Area */}
                {bookingData.city && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Area/Thana
                    </label>
                    <input
                      type="text"
                      value={bookingData.area}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, area: e.target.value })
                      }
                      placeholder="Enter area or thana"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900"
                    />
                  </div>
                )}

                {/* Full Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Address
                  </label>
                  <textarea
                    value={bookingData.address}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        address: e.target.value,
                      })
                    }
                    placeholder="House/Flat number, Road, Block, etc."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 resize-none"
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={bookingData.specialInstructions}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        specialInstructions: e.target.value,
                      })
                    }
                    placeholder="Any special requirements or instructions for the caregiver"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-6">
                Review & Payment
              </h2>
              <p className="text-slate-600 mb-5 sm:mb-8">
                Review your booking and proceed to payment
              </p>

              <div className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Booking Summary
                  </h3>

                  {/* Caregiver Info */}
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                    {(() => {
                      const selectedCaregiver = caregivers.find(
                        (c) => c.id === bookingData.caregiverId,
                      );
                      return selectedCaregiver ? (
                        <>
                          <img
                            src={
                              selectedCaregiver.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCaregiver.name)}&size=64&background=0d9488&color=fff`
                            }
                            alt={selectedCaregiver.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">
                              {selectedCaregiver.name}
                            </p>
                            <p className="text-sm text-slate-600">
                              {selectedCaregiver.experience} years experience
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-slate-600">No caregiver selected</p>
                      );
                    })()}
                  </div>

                  {/* Schedule */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="material-icons text-teal-600 text-sm">
                        calendar_today
                      </span>
                      <span className="text-sm">
                        {bookingData.startDate && bookingData.startTime
                          ? `${bookingData.startDate} at ${bookingData.startTime}`
                          : "Not selected"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="material-icons text-teal-600 text-sm">
                        schedule
                      </span>
                      <span className="text-sm">
                        {bookingData.durationValue}{" "}
                        {bookingData.durationType.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="material-icons text-teal-600 text-sm">
                        location_on
                      </span>
                      <div className="text-sm">
                        <p>
                          {bookingData.area}, {bookingData.city}
                        </p>
                        <p>
                          {bookingData.district}, {bookingData.division}
                        </p>
                        <p className="text-slate-600 mt-1">
                          {bookingData.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Price Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-700">
                      <span>
                        Base Rate ($25/hr × {bookingData.durationValue})
                      </span>
                      <span className="font-semibold">
                        ${25 * bookingData.durationValue}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Platform Fee (10%)</span>
                      <span className="font-semibold">
                        ${(25 * bookingData.durationValue * 0.1).toFixed(2)}
                      </span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount ({promoCode})</span>
                        <span className="font-semibold">
                          -${promoDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t-2 border-slate-300 flex justify-between text-lg font-bold text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-teal-600">
                        $
                        {(
                          25 * bookingData.durationValue * 1.1 -
                          promoDiscount
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="bg-slate-50 rounded-xl p-6">
                  {/* Promo Banner */}
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 mb-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-3xl">
                        local_offer
                      </span>
                      <div>
                        <p className="font-bold text-lg">New User Offer!</p>
                        <p className="text-sm text-teal-50">
                          Use code{" "}
                          <span className="font-mono font-bold bg-white/20 px-2 py-1 rounded">
                            WELCOME10
                          </span>{" "}
                          to get $10 off your first booking
                        </p>
                      </div>
                    </div>
                  </div>

                  <PromoCodeInput
                    bookingAmount={25 * bookingData.durationValue * 1.1}
                    onApply={(discount, code) => {
                      setPromoDiscount(discount);
                      setPromoCode(code);
                    }}
                  />
                </div>

                {/* Payment Method */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Payment Method
                  </h3>

                  {/* Test Card Info Banner */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-blue-600">info</span>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 mb-2">
                          Test Mode - Use Test Card
                        </p>
                        <div className="text-sm text-blue-800 space-y-1">
                          <p className="font-mono bg-white px-2 py-1 rounded inline-block">
                            Card: 5555 5555 5555 4444
                          </p>
                          <p className="font-mono bg-white px-2 py-1 rounded inline-block sm:ml-2">
                            Expiry: 12/32
                          </p>
                          <p className="font-mono bg-white px-2 py-1 rounded inline-block sm:ml-2">
                            CVC: 633
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white border-2 border-teal-600 rounded-lg">
                    <span className="material-icons text-teal-600">
                      credit_card
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Stripe Checkout
                      </p>
                      <p className="text-sm text-slate-600">
                        Secure payment via Stripe
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <span className="material-icons text-yellow-600 text-sm">
                      info
                    </span>
                    <p className="text-sm text-yellow-800">
                      By proceeding, you agree to our Terms of Service and
                      Cancellation Policy. Payment will be processed securely
                      through Stripe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 sm:mt-8 gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-icons">arrow_back</span>
            <span className="hidden sm:inline">Back</span>
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !bookingData.caregiverId) ||
                (currentStep === 2 &&
                  (!bookingData.startDate ||
                    !bookingData.startTime ||
                    !bookingData.durationValue)) ||
                (currentStep === 3 &&
                  (!bookingData.division ||
                    !bookingData.district ||
                    !bookingData.address))
              }
              className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Continue
              <span className="material-icons">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Proceed to Payment</span>
                  <span className="sm:hidden">Pay Now</span>
                  <span className="material-icons">payment</span>
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
