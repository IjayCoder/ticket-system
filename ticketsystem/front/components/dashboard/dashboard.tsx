"use client";

import { AdminDashboard } from "@/components/dashboard/adminDashboard/admin-dashboard";
import { UserDashboard } from "@/components/dashboard/userDashboard/user-dashboard";
import { DevDashboard } from "@/components/dashboard/devDashbord/dev-dashboard";
import { UserMenu } from "@/components/user-menu";
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown";
import type { User } from "@/types";

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const getDashboardTitle = () => {
    switch (user.role) {
      case "ADMIN":
        return "Administrator Dashboard";
      case "DEV":
        return "Developer Dashboard";
      case "CLIENT":
        return "User Dashboard";
      default:
        return "Dashboard";
    }
  };

  const renderDashboard = () => {
    switch (user.role) {
      case "ADMIN":
        return <AdminDashboard user={user} />;
      case "DEV":
        return <DevDashboard user={user} />;
      case "CLIENT":
        return <UserDashboard user={user} />;
      default:
        return <UserDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold truncate">
                Bug Tracker
              </h1>
              <div className="hidden sm:block text-sm text-muted-foreground">
                {getDashboardTitle()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationsDropdown user={user} />
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </div>

      {/* Role-based Dashboard */}
      {renderDashboard()}
    </div>
  );
}
