"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Priority, Status } from "@/types";

interface TicketFiltersProps {
  filters: {
    status?: Status;
    priority?: Priority;
  };
  onFilterChange: (key: string, value: string | undefined) => void;
  onClearFilters: () => void;
}

export function TicketFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: TicketFiltersProps) {
  const hasActiveFilters = filters.status || filters.priority;

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Select
          value={filters.status || "All Status"}
          onValueChange={(value) =>
            onFilterChange("status", value || undefined)
          }
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority || "All Priority"}
          onValueChange={(value) =>
            onFilterChange("priority", value || undefined)
          }
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Priority">All Priority</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full sm:w-auto bg-transparent"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
