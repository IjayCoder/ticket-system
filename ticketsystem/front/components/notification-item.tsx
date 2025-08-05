"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Info, Check } from "lucide-react";
import type { Notification } from "@/types";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const [isMarking, setIsMarking] = useState(false);
  const [isRead, setIsRead] = useState(notification.isRead);

  const getIcon = (type: Notification["type"]) => {
    const iconClass = "h-5 w-5 flex-shrink-0";
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case "warning":
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case "error":
        return <XCircle className={`${iconClass} text-red-500`} />;
      case "info":
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

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

  return (
    <Card
      className={`transition-all duration-200 ${
        !isRead ? "bg-blue-50/50 border-blue-200" : "bg-background"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-0.5">{getIcon(notification.type)}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-medium text-sm leading-tight">
                {notification.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isRead && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 animate-in fade-in-0 duration-200"
                  >
                    Unread
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {getRelativeTime(notification.createdAt)}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {notification.message}
            </p>

            {/* Actions */}
            <div className="flex justify-end">
              {!isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  disabled={isMarking}
                  className="h-8 px-3 text-xs"
                >
                  {isMarking ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Mark as read
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
