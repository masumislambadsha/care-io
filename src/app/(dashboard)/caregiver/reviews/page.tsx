"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Review = {
  id: string;
  client_name: string;
  client_image: string;
  rating: number;
  comment: string;
  service_name: string;
  created_at: string;
};

export default function CaregiverReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "CAREGIVER") {
        router.push("/dashboard");
        return;
      }
      fetchReviews();
    }
  }, [status, router, session]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      if (!session?.user?.id) return;

      const response = await fetch(
        `/api/reviews?caregiverId=${session.user.id}`,
      );
      const data = await response.json();

      if (response.ok) {
        const reviewsData = data.reviews.map((r: any) => ({
          id: r.id,
          client_name: r.client?.name || "Anonymous",
          client_image: r.client?.image || "",
          rating: r.rating,
          comment: r.comment,
          service_name: "Service", // You can add this to the API
          created_at: r.created_at,
        }));
        setReviews(reviewsData);

        // Calculate stats
        const total = reviewsData.length;
        const avgRating =
          total > 0
            ? reviewsData.reduce(
                (sum: number, r: Review) => sum + r.rating,
                0,
              ) / total
            : 0;

        setStats({
          avgRating,
          totalReviews: total,
          fiveStars: reviewsData.filter((r: Review) => r.rating === 5).length,
          fourStars: reviewsData.filter((r: Review) => r.rating === 4).length,
          threeStars: reviewsData.filter((r: Review) => r.rating === 3).length,
          twoStars: reviewsData.filter((r: Review) => r.rating === 2).length,
          oneStar: reviewsData.filter((r: Review) => r.rating === 1).length,
        });
      } else {
        toast.error("Failed to load reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 mb-2">
          My Reviews
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          See what clients say about you
        </p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
        {/* Average Rating Card */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg p-8 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-2">Average Rating</p>
            <p className="text-6xl font-bold mb-2">
              {stats.avgRating.toFixed(1)}
            </p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`material-icons ${
                    i < Math.floor(stats.avgRating)
                      ? "text-white"
                      : "text-white/30"
                  }`}
                >
                  star
                </span>
              ))}
            </div>
            <p className="text-sm opacity-90">
              Based on {stats.totalReviews} reviews
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[
              { stars: 5, count: stats.fiveStars },
              { stars: 4, count: stats.fourStars },
              { stars: 3, count: stats.threeStars },
              { stars: 2, count: stats.twoStars },
              { stars: 1, count: stats.oneStar },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-semibold text-slate-900">
                    {item.stars}
                  </span>
                  <span className="material-icons text-yellow-400 text-sm">
                    star
                  </span>
                </div>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{
                      width: `${stats.totalReviews > 0 ? (item.count / stats.totalReviews) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-slate-600 w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              rate_review
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-slate-600">
            Complete bookings to receive reviews from clients
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    review.client_image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(review.client_name)}&size=60&background=0d9488&color=fff`
                  }
                  alt={review.client_name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {review.client_name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-icons text-sm ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-slate-300"
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
