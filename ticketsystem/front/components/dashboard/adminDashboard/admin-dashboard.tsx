"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent } from "@/components/ui/select";
import { TicketFilters } from "@/components/ticket/ticket-filters";
import { PriorityBadge } from "@/components/priority-badge";
import { Pagination } from "@/components/pagination";
import { TicketDetailsModal } from "@/components/ticket/ticket-details-modal";
import { TicketEditModal } from "@/components/ticket/ticket-edit-modal";
import {
  Bug,
  Users,
  Clock,
  CheckCircle,
  Grid,
  List,
  Send,
  EyeOff,
  Trash2,
} from "lucide-react";
import type { User } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";
import { NotificationModal } from "../../notifications/notification-modal";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const {
    tickets,
    stats,
    loading,
    error,
    viewMode,
    setViewMode,
    filters,
    handleFilterChange,
    handleClearFilters,

    selectedTicket,
    setSelectedTicket,
    detailsModalOpen,
    setDetailsModalOpen,
    editModalOpen,
    setEditModalOpen,
    notificationModalOpen,
    setNotificationModalOpen,
    page,
    setPage,
    totalPages,
    total,
    handleTicketClick,
    handleEditClick,
    handleOpenNotification,
    handleAssignTicket,
    fetchTickets,
  } = useAdminDashboard(user);

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2 sm:w-1/4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
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
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Supervise tickets and manage assignments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value={stats.total} icon={<Bug />} />
        <StatCard
          title="Unopen"
          value={stats.unopen}
          icon={<EyeOff className="text-blue-500" />}
          valueClass="text-red-600"
        />
        <StatCard
          title="Open"
          value={stats.open}
          icon={<Clock className="text-red-500" />}
          valueClass="text-red-600"
        />
        <StatCard
          title="In Progress"
          value={stats.in_progress}
          icon={<Users className="text-yellow-500" />}
          valueClass="text-yellow-600"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircle className="text-green-500" />}
          valueClass="text-green-600"
        />
      </div>

      {/* Filters */}
      <TicketFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* View toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Table</span>
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            <Grid className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Cards</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {tickets.length} of {total} tickets
        </p>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Title</TableHead>
                  <TableHead className="min-w-[120px]">Created By</TableHead>
                  <TableHead className="min-w-[140px]">Assigned To</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div>
                        <button
                          onClick={() => handleTicketClick(ticket)}
                          className="font-medium hover:text-primary cursor-pointer text-left"
                        >
                          {ticket.title}
                        </button>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {ticket.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(ticket.client.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {ticket.client.fullName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={ticket.assignedDev?.fullName}
                        onValueChange={(value) =>
                          handleAssignTicket(String(ticket.id), value)
                        }
                      >
                        <div className="w-32">
                          <div>
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className="text-xs">
                                  {getInitials(
                                    ticket.assignedDev?.fullName || ""
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">
                                {ticket.assignedDev?.fullName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <SelectContent>
                          {/* {devUsers.map((dev) => (
                            <SelectItem key={dev.id} value={dev.id}>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-4 w-4">
                                  <AvatarFallback className="text-xs">
                                    {initials(dev.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{dev.name}</span>
                              </div>
                            </SelectItem>
                          ))} */}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ticket.projectName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === "OPEN"
                            ? "destructive"
                            : ticket.status === "IN_PROGRESS"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(ticket.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenNotification(ticket)}
                          title="Send notification to assigned dev"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="delete ticket">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

      <TicketDetailsModal
        ticket={selectedTicket}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
      <TicketEditModal
        ticket={selectedTicket}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onTicketUpdated={fetchTickets}
      />

      <NotificationModal
        ticket={selectedTicket}
        open={notificationModalOpen}
        onOpenSend={setNotificationModalOpen}
        user={user}
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
("");
