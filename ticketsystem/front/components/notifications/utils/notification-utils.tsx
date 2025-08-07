// components/notification/utils/notification-utils.ts
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import type { Notification } from "@/types";

export const getIcon = (type: Notification["type"]) => {
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

export const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};
