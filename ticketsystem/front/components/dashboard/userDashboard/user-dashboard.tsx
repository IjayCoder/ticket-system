"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TicketForm } from "@/components/ticket/ticket-form";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { TicketDetailsModal } from "@/components/ticket/ticket-details-modal";
import { Bug, Clock, CheckCircle, Edit, Trash2 } from "lucide-react";
import type { User } from "@/types";

import { formatDate, getInitials } from "@/lib/utils";
import { TicketEditModal } from "@/components/ticket/ticket-edit-modal";
import { Pagination } from "@/components/pagination";
import { useUserDashboard } from "@/hooks/useUserDashboard";

interface UserDashboardProps {
  user: User;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [page, setPage] = useState(1);
  const {
    tickets,
    loading,
    stats,
    totalPages,
    selectedTicket,
    setSelectedTicket,
    detailsModalOpen,
    setDetailsModalOpen,
    editModalOpen,
    setEditModalOpen,
    handleDeleteTicket,
    handleTicketClick,
    handleTicketUpdated,
    handleEdit,
    fetchTickets,
  } = useUserDashboard(page);

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2 sm:w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Tickets
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Welcome back, {user.fullName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TicketForm onTicketCreated={fetchTickets} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="My Tickets" value={stats.total || 0} icon={<Bug />} />

        <StatCard
          title="Open"
          value={stats.open || 0}
          icon={<Clock className="text-red-500" />}
          valueClass="text-red-600"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved || 0}
          icon={<CheckCircle className="text-green-500" />}
          valueClass="text-green-600"
        />
      </div>

      {/* My Tickets */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Your Tickets</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {tickets ? (
            tickets.length === 0 ? (
              <div className="text-center py-8">
                <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Create your first ticket to get started
                </p>
                <TicketForm onTicketCreated={fetchTickets} />
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <div className="flex flex-col gap-4">
                      {/* Header with title and badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium text-sm sm:text-base line-clamp-2 flex-1">
                          {ticket.title}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <StatusBadge status={ticket.status} />
                          <PriorityBadge priority={ticket.priority} />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.description}
                      </p>

                      {/* Bottom section with info and actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Left side - Project and Assigned info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                          {/* Mobile Layout */}
                          <div className="flex flex-col gap-2 sm:hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Project:
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {ticket.projectName}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Assigned to:
                              </span>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarFallback className="text-xs">
                                    {getInitials(ticket.assignedDev?.fullName!)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs">
                                  {ticket.assignedDev?.fullName}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden sm:flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Project:
                              </span>
                              <Badge variant="outline">
                                {ticket.projectName}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Assigned to:
                              </span>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">
                                    {getInitials(ticket.assignedDev?.fullName!)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{ticket.assignedDev?.fullName}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right side - Date and Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                          {/* Date - always visible and positioned */}
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {formatDate(ticket.createdAt)}
                          </span>

                          {/* Action Buttons - fixed width container to prevent layout shift */}
                          <div className="flex items-center gap-2 w-20 justify-end">
                            {(ticket.status === "UNOPEN" ||
                              ticket.status === "OPEN") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(ticket);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTicket(ticket.id);
                              }}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p>Loading tickets…</p>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <TicketEditModal
        ticket={selectedTicket}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onTicketUpdated={handleTicketUpdated}
      />

      <TicketDetailsModal
        ticket={selectedTicket}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  valueClass = "",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 sm:h-5 sm:w-5">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-xl sm:text-2xl font-bold ${valueClass}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
