import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export const NotificationEmptyState = ({ error }: { error?: string }) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="text-muted-foreground mb-6">
          <Bell className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-medium mb-2">
          {error ? "Error loading notifications" : "No notifications"}
        </h3>
        <p className="text-muted-foreground">
          {error
            ? error
            : "You're all caught up! New notifications will appear here."}
        </p>
      </CardContent>
    </Card>
  );
};
