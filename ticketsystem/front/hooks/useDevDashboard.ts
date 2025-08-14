// hooks/useDevDashboard.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  GetDashbordStats,
  GetMyTickets,
  UpdateStatus,
} from "@/lib/apiLinks/ticket";
import { toast } from "sonner";
import type { FilterState, Status, Ticket, User } from "@/types";

export function useDevDashboard(user: User) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState<FilterState>({
    status: "ALL",
    priority: "ALL",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

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

  const fetchStats = async () => {
    try {
      const result = await GetDashbordStats();
      setStats(result);
    } catch (err: any) {
      setError(err.message || "Failed to load stats");
    }
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: Status) => {
    try {
      await UpdateStatus(ticketId, newStatus);
      toast.success("Changed", {
        description: "Ticket status updated",
      });
    } catch {
      toast.error("Error", {
        description: "Failed to update ticket status",
      });
    }
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ status: "ALL", priority: "ALL" });
    setPage(1);
  };

  const handleEditClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  };

  const handleOpenNotification = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setNotificationModalOpen(true);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailsModalOpen(true);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchStatus =
        !filters.status ||
        filters.status === "ALL" ||
        ticket.status === filters.status;
      const matchPriority =
        !filters.priority ||
        filters.priority === "ALL" ||
        ticket.priority === filters.priority;
      return matchStatus && matchPriority;
    });
  }, [tickets, filters]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  useEffect(() => {
    fetchTickets();
  }, [page]);

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    tickets: filteredTickets,
    page,
    setPage,
    totalPages,
    total,
    filters,
    stats,
    loading,
    error,
    selectedTicket,
    setSelectedTicket,
    notificationModalOpen,
    setNotificationModalOpen,
    detailsModalOpen,
    setDetailsModalOpen,
    editModalOpen,
    setEditModalOpen,
    handleStatusUpdate,
    handleFilterChange,
    handleClearFilters,
    handleEditClick,
    handleTicketClick,
    formatDate,
    handleOpenNotification,
    fetchTickets,
  };
}
