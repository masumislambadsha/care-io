"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link?: string;
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchNotifications();
    }
  }, [status, router]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
      } else {
        toast.error("Failed to load notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });

      if (response.ok) {
        toast.success("All notifications marked as read");
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        toast.success("Notification deleted");
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING_CREATED":
        return "event_available";
      case "BOOKING_STATUS_UPDATED":
        return "update";
      case "BOOKING_CANCELLED":
        return "event_busy";
      case "PAYMENT_SUCCESS":
        return "payment";
      case "REVIEW_RECEIVED":
        return "star";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "BOOKING_CREATED":
        return "bg-blue-100 text-blue-600";
      case "BOOKING_STATUS_UPDATED":
        return "bg-purple-100 text-purple-600";
      case "BOOKING_CANCELLED":
        return "bg-red-100 text-red-600";
      case "PAYMENT_SUCCESS":
        return "bg-green-100 text-green-600";
      case "REVIEW_RECEIVED":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 mb-2">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Stay updated with your activities
        </p>
      </div>

      {/* Stats & Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm text-slate-600">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900">
                {notifications.length}
              </p>
            </div>
            <div className="w-px h-10 sm:h-12 bg-slate-200"></div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600">Unread</p>
              <p className="text-lg sm:text-2xl font-bold text-teal-600">
                {unreadCount}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              filter === "all"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              filter === "unread"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              notifications_none
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {filter === "unread"
              ? "No unread notifications"
              : "No notifications yet"}
          </h3>
          <p className="text-slate-600">
            {filter === "unread"
              ? "You're all caught up!"
              : "We'll notify you when something happens"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border transition-all ${
                !notification.is_read
                  ? "border-teal-200 bg-teal-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type,
                    )}`}
                  >
                    <span className="material-icons">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className={`font-bold ${
                          !notification.is_read
                            ? "text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-3">
                      {notification.message}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(notification.created_at).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
                  {notification.link && (
                    <Link
                      href={notification.link}
                      onClick={() => markAsRead(notification.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all text-sm"
                    >
                      View Details
                    </Link>
                  )}
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-4 py-2 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-all text-sm ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
