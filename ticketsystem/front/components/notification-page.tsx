"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NotificationItem } from "@/components/notification-item";
import { Bell, ArrowLeft, CheckCheck, Loader2 } from "lucide-react";
import type { Notification, User } from "@/types";
import {
  GetNotification,
  MarkAllNotificationsAsRead,
  MarkNotificationAsRead,
} from "@/lib/apiLinks/notification";
import { toast } from "sonner";

interface NotificationsPageProps {
  user: User;
}

export function NotificationsPage({ user }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch notifications on mount
  /* useEffect(() => {
    fetchNotifications();
  }, []);*/

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userNotifications = await GetNotification();
        setNotifications(userNotifications);
      } catch (error) {
        toast.success("Error", {
          description: "Error occurs when fetching notifications",
        });
      } finally {
        setLoading(false); // ✅ indispensable
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  /*const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/notification");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
      showToast("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };*/

  /* const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notification/${notificationId}/read`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );

      showToast("Notification marked as read", "success");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      showToast("Failed to mark notification as read", "error");
      throw error;
    }
  };

  const markAllAsRead = async () => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    if (unreadCount === 0) return;

    setMarkingAllAsRead(true);
    try {
      const response = await fetch("/api/notification/read-all", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      const result = await response.json();

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      showToast(
        `Marked ${result.updatedCount} notifications as read`,
        "success"
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      showToast("Failed to mark all notifications as read", "error");
    } finally {
      setMarkingAllAsRead(false);
    }
  };*/

  const markAsRead = async (notificationId: string) => {
    try {
      await MarkNotificationAsRead(notificationId);

      // Refetch après maj serveur
      const updated = await GetNotification();
      setNotifications(updated);
    } catch (err) {
      console.error("Erreur Mark as Read :", err);
    }
  };

  // 🔹 Tout marquer comme lu
  const markAllAsRead = async () => {
    try {
      await MarkAllNotificationsAsRead();
      const updated = await GetNotification();
      setNotifications(updated);
    } catch (err) {
      console.error("Erreur Mark All as Read :", err);
    }
  };
  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="p-2 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold">
                My Notifications
              </h1>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="p-2 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold">
                My Notifications
              </h1>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="container mx-auto p-4 sm:p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Bell className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Error Loading Notifications
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Toast */}

      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="p-2 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">
                  My Notifications
                </h1>
                <p className="text-sm text-muted-foreground">
                  {notifications.length === 0
                    ? "No notifications"
                    : `${notifications.length} total, ${unreadCount} unread`}
                </p>
              </div>
            </div>

            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                disabled={markingAllAsRead}
                className="w-full sm:w-auto bg-transparent"
                variant="outline"
              >
                {markingAllAsRead ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4 mr-2" />
                )}
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        {notifications.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground mb-6">
                <Bell className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Notifications List */
          <div className="space-y-4">
            {/* Unread Notifications */}
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Unread ({notifications.filter((n) => !n.isRead).length})
                  </h2>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-3">
                  {notifications
                    .filter((n) => !n.isRead)
                    .map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Read Notifications */}
            {notifications.filter((n) => n.isRead).length > 0 && (
              <div>
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <div className="h-6" />
                )}
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Read ({notifications.filter((n) => n.isRead).length})
                  </h2>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-3">
                  {notifications
                    .filter((n) => n.isRead)
                    .map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
