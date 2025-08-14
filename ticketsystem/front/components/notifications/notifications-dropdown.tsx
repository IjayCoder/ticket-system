"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Eye } from "lucide-react";
import type { Notification, User } from "@/types";
import {
  GetNotification,
  MarkAllNotificationsAsRead,
  MarkNotificationAsRead,
} from "@/lib/apiLinks/notification";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NotificationsDropdownProps {
  user: User;
}

export function NotificationsDropdown({ user }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userNotifications = await GetNotification();
        setNotifications(userNotifications.slice(0, 4));
      } catch (error) {
        toast.error("Error", {
          description: "Error when getting the notifications",
        });
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 🔹 Marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    try {
      await MarkNotificationAsRead(notificationId);

      // Refetch après maj serveur
      const updated = await GetNotification();
      //setNotifications(updated);
      setNotifications(updated.slice(0, 3));
    } catch (err) {
      console.error("Erreur Mark as Read :", err);
    }
  };

  // 🔹 Tout marquer comme lu
  const markAllAsRead = async () => {
    try {
      await MarkAllNotificationsAsRead();
      const updated = await GetNotification();
      //setNotifications(updated);
      setNotifications(updated.slice(0, 3));
    } catch (err) {
      console.error("Erreur Mark All as Read :", err);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "warning":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (id: string) => {
    setOpen(false); // Fermer le menu
    router.push(`/notification?id=${id}`);
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push("/notification");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 3 ? "3+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-6 text-xs"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`flex items-start justify-between gap-2 p-3 ${
                    !notification.isRead ? "bg-muted/50" : ""
                  } cursor-pointer`}
                >
                  {/* Bloc gauche */}
                  <div className="flex gap-3 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Bouton Mark as read individuel */}
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleViewAll}
              className="text-center justify-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
