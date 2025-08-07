// hooks/useNotifications.ts
import { useState, useEffect } from "react";
import {
  GetNotification,
  MarkNotificationAsRead,
  MarkAllNotificationsAsRead,
} from "@/lib/apiLinks/notification";
import { Notification } from "@/types";
import { toast } from "sonner";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await GetNotification();
      setNotifications(data);
    } catch (err) {
      toast.error("Failed to fetch notifications");
      setError("Could not fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await MarkNotificationAsRead(id);
      await fetchNotifications();
    } catch (err) {
      toast.error("Could not mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true);
      await MarkAllNotificationsAsRead();
      await fetchNotifications();
    } catch (err) {
      toast.error("Could not mark all as read");
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markingAllAsRead,
    markAsRead,
    markAllAsRead,
  };
}
