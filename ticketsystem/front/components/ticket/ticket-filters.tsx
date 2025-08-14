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

type Key = "status" | "priority";

interface TicketFiltersProps {
  filters: {
    status?: Status | "ALL";
    priority?: Priority | "ALL";
  };
  onFilterChange: (key: Key, value: Status | Priority | "ALL") => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS: { value: Status | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Status" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "UNOPEN", label: "Unopen" },
];

const PRIORITY_OPTIONS: { value: Priority | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Priority" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export function TicketFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: TicketFiltersProps) {
  const hasActive =
    (filters.status && filters.status !== "ALL") ||
    (filters.priority && filters.priority !== "ALL");

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {/* STATUS */}
        <Select
          value={filters.status ?? "ALL"}
          onValueChange={(value) =>
            onFilterChange("status", value as Status | "ALL")
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* PRIORITY */}
        <Select
          value={filters.priority ?? "ALL"}
          onValueChange={(value) =>
            onFilterChange("priority", value as Priority | "ALL")
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActive && (
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
