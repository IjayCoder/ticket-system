import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types";

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500 text-white hover:bg-red-500";
      case "MEDIUM":
        return "bg-orange-500 text-white hover:bg-orange-500";
      case "LOW":
        return "bg-blue-500 text-white hover:bg-blue-500";
      default:
        return "bg-gray-500 text-white hover:bg-gray-500";
    }
  };

  return <Badge className={getPriorityColor(priority)}>{priority}</Badge>;
}
