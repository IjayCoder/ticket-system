import { Badge } from "@/components/ui/badge";
import type { Status } from "@/types";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "UNOPEN":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "OPEN":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "RESOLVED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return <Badge className={getStatusColor(status)}>{status}</Badge>;
}
