"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { TicketEditModal } from "@/components/ticket/ticket-edit-modal";
import {
  Calendar,
  User,
  Folder,
  Clock,
  Edit,
  MessageSquare,
} from "lucide-react";
import type { Ticket, TicketWithDetails, User as UserType } from "@/types";
import { getInitials } from "@/lib/utils";

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser?: UserType;
  onTicketUpdated?: () => void;
}

export function TicketDetailsModal({
  ticket,
  open,
  onOpenChange,
  currentUser,
  onTicketUpdated,
}: TicketDetailsModalProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (!ticket) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysSinceCreated = () => {
    const created = new Date(ticket.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const canEdit =
    currentUser &&
    (currentUser.role === "ADMIN" ||
      currentUser.role === "DEV" ||
      (currentUser.role === "CLIENT" && ticket.createdById === currentUser.id));

  const handleEditClick = () => {
    setEditModalOpen(true);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold pr-8">
                  {ticket.title}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Ticket #{ticket.id}
                </p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ticket.description}
              </p>
            </div>

            <Separator />

            {/* Project & Assignment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Project</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.projectName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(ticket.assignedDev?.fullName!)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {ticket.assignedDev?.fullName}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {ticket.assignedDev?.email}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {ticket.assignedDev?.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(ticket.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getDaysSinceCreated()} days ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Technical Details */}
            <div>
              <h3 className="font-medium mb-3">Technical Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Environment:</span>
                  <span className="ml-2">Production</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Browser:</span>
                  <span className="ml-2">Chrome 120.0</span>
                </div>
                <div>
                  <span className="text-muted-foreground">OS:</span>
                  <span className="ml-2">Windows 11</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <span className="ml-2">v2.1.4</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={handleEditClick}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Ticket
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {currentUser && (
        <TicketEditModal
          ticket={ticket}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onTicketUpdated={() => {
            onTicketUpdated?.();
            setEditModalOpen(false);
          }}
        />
      )}
    </>
  );
}
