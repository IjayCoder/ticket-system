// components/notification/hooks/useNotificationItem.ts
import { useState } from "react";
import type { Notification } from "@/types";

export function useNotificationItem(
  notification: Notification,
  onMarkAsRead: (id: string) => Promise<void>
) {
  const [isMarking, setIsMarking] = useState(false);
  const [isRead, setIsRead] = useState(notification.isRead);

  const handleMarkAsRead = async () => {
    if (isRead) return;

    setIsMarking(true);
    try {
      await onMarkAsRead(notification.id);
      setIsRead(true);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setIsMarking(false);
    }
  };

  return {
    isRead,
    isMarking,
    handleMarkAsRead,
  };
}
