"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Loader2 } from "lucide-react";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { NotificationEmptyState } from "@/components/notifications/notifications-empty-state";
import { User } from "@/types";

interface Props {
  user: User;
}

export function NotificationsPage({ user }: Props) {
  const router = useRouter();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markingAllAsRead,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-background">
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

            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                disabled={markingAllAsRead}
                variant="outline"
              >
                {markingAllAsRead ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <>Mark all as read</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : error ? (
          <NotificationEmptyState error={error} />
        ) : notifications.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <NotificationsList
            notifications={notifications}
            onMarkAsRead={markAsRead}
          />
        )}
      </div>
    </div>
  );
}
