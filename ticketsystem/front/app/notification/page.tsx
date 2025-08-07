"use client";

import { HashLoader } from "react-spinners";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NotificationsPage } from "@/components/notifications/notification-page";

export default function Notifications() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <HashLoader size={50} />
      </div>
    );
  }

  if (!user) return null;

  return <NotificationsPage user={user} />;
}
