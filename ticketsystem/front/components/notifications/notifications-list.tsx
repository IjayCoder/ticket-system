import { NotificationItem } from "@/components/notifications/notification-item";
import { Separator } from "@/components/ui/separator";
import { Notification } from "@/types";

interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: string) => Promise<void>;
}

export const NotificationsList = ({ notifications, onMarkAsRead }: Props) => {
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <div className="space-y-4">
      {unread.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Unread ({unread.length})
            </h2>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-3">
            {unread.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 mt-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Read ({read.length})
            </h2>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-3">
            {read.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
