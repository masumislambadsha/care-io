"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setNotifications,
  setUnreadCount,
} from "@/store/slices/notificationSlice";
import { formatDistanceToNow } from "date-fns";

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
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{
    top: number;
    left?: number;
    right?: number;
  }>({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notification,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropRef.current &&
        !dropRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!mounted) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      if (response.ok) {
        const notifs = data.notifications || [];
        dispatch(setNotifications(notifs));
        dispatch(
          setUnreadCount(notifs.filter((n: Notification) => !n.is_read).length),
        );
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
      if (response.ok) fetchNotifications();
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
    if (notification.link) router.push(notification.link);
    setIsOpen(false);
  };

  function handleToggle() {
    if (!isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const dropdownWidth = Math.min(320, window.innerWidth - 16);
      const rightFromEdge = window.innerWidth - rect.right;
      const wouldOverflowLeft = rect.right - dropdownWidth < 8;
      setPos(
        wouldOverflowLeft
          ? { top: rect.bottom + 8, left: 8 }
          : { top: rect.bottom + 8, right: rightFromEdge },
      );
    }
    setIsOpen((prev) => !prev);
  }

  if (!mounted) {
    return (
      <div className="relative">
        <button className="relative p-1 cursor-pointer rounded-lg text-teal-600 transition-colors">
          <span className="material-symbols-outlined text-xl">
            notifications
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="relative p-1 rounded-lg cursor-pointer text-teal-600 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropRef}
          className="fixed bg-white rounded-xl shadow-2xl border border-teal-100 z-[200] overflow-hidden"
          style={{
            top: pos.top,
            ...(pos.left !== undefined
              ? { left: pos.left }
              : { right: pos.right }),
            width: Math.min(320, window.innerWidth - 16),
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-teal-100">
            <span className="font-bold text-teal-700 text-sm">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-amber-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div
            className="max-h-80 overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
          >
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-teal-300 text-2xl">
                    notifications
                  </span>
                </div>
                <p className="text-sm text-slate-400">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full px-4 py-3 border-b border-slate-100 last:border-0 text-left transition-colors hover:bg-teal-50 ${
                    !notif.is_read ? "bg-amber-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        !notif.is_read ? "bg-amber-500" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 leading-snug">
                        {notif.title}
                      </p>
                      <p className="text-sm text-slate-500 leading-snug mt-0.5">
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDistanceToNow(new Date(notif.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs text-teal-600 hover:underline font-semibold"
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
