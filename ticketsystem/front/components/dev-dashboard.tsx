"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketFilters } from "@/components/ticket-filters";
import { PriorityBadge } from "@/components/priority-badge";
import { Pagination } from "@/components/pagination";
import { TicketDetailsModal } from "@/components/ticket-details-modal";
import { TicketEditModal } from "@/components/ticket-edit-modal";
import { Clock, CheckCircle, Edit, Code, Send } from "lucide-react";
import type {
  TicketWithDetails,
  PaginatedResponse,
  Priority,
  Status,
  User,
  Ticket,
} from "@/types";
import {
  GetDashbordStats,
  GetMyTickets,
  UpdateStatus,
} from "@/lib/apiLinks/ticket";
import { getInitials } from "@/lib/utils";
import { NotificationModal } from "./notification-modal";
import { toast } from "sonner";

interface DevDashboardProps {
  user: User;
}

export function DevDashboard({ user }: DevDashboardProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  //const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  //const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<{
    status?: Status;
    priority?: Priority;
  }>({});
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  /* const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        assignedToId: user.id, // Only show tickets assigned to this dev
      });

      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);

      const response = await fetch(`/api/tickets?${params}`);
      const data: PaginatedResponse<TicketWithDetails> = await response.json();

      setTickets(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };*/

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { tickets, totalPages, total } = await GetMyTickets(page);
      setTickets(tickets);
      setTotalPages(totalPages);
      setTotal(total);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to fetch tickets",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page]);

  /*useEffect(() => {
    fetchTickets();
  }, [currentPage, filters, user.id]);*/

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleStatusUpdate = async (ticketId: number, newStatus: Status) => {
    try {
      await UpdateStatus(ticketId, newStatus);
      toast.success("Changed", {
        description: "Tickets status changed!! ",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update ticket status",
      });
    }
  };

  /* const getStatusCounts = () => {
    const counts = { open: 0, inProgress: 0, resolved: 0 };
    tickets.forEach((t) => {
      if (t.status === "OPEN") counts.open++;
      else if (t.status === " IN_PROGRESS ") counts.inProgress++;
      else if (t.status === "RESOLVED") counts.resolved++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();*/

  useEffect(() => {
    const getStatusCounts = async () => {
      try {
        const result = await GetDashbordStats();
        setStats(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    getStatusCounts();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /*const initials = (n: string) =>
    n
      .split(" ")
      .map((s) => s[0])
      .join("")
      .toUpperCase();*/

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailsModalOpen(true);
  };

  const handleEditClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  };

  const handleOpenNotification = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setNotificationModalOpen(true);
  };

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
            Developer Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your assigned tickets
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned Tickets"
          value={stats.totalAssign}
          icon={<Code className="text-blue-500" />}
          valueClass="text-blue-600"
        />
        <StatCard
          title="In Progress"
          value={stats.in_progress}
          icon={<Clock className="text-yellow-500" />}
          valueClass="text-yellow-600"
        />
        <StatCard
          title="Completed"
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

      {/* Tickets */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>My Assigned Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tickets assigned</h3>
              <p className="text-muted-foreground">
                You don't have any tickets assigned to you yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[120px]">Created By</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="min-w-[140px]">Status</TableHead>
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
                        <Badge variant="outline">{ticket.projectName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={ticket.status}
                          onValueChange={(value: Status) =>
                            handleStatusUpdate(ticket.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UNOPEN">
                              {ticket.status}
                            </SelectItem>
                            <SelectItem value="OPEN">OPEN</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              IN_PROGRESS
                            </SelectItem>
                            <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenNotification(ticket)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
