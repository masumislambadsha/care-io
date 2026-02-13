"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setNotifications, setUnreadCount } from "@/store/slices/notificationSlice";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link?: string;
};

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Redux state
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((state) => state.notification);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();

      if (response.ok) {
        const notifs = data.notifications || [];
        dispatch(setNotifications(notifs));
        dispatch(setUnreadCount(notifs.filter((n: Notification) => !n.is_read).length));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
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

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <span className="material-icons text-slate-600">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[500px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-icons text-slate-400 text-3xl">
                    notifications_none
                  </span>
                </div>
                <p className="text-slate-600 font-medium">No notifications yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  We'll notify you when something happens
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
                    !notif.is_read ? "bg-teal-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        !notif.is_read ? "bg-teal-600" : "bg-transparent"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          !notif.is_read ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-200">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

