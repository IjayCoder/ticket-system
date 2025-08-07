"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GetMyTickets,
  DeleteTicket,
  GetDashbordStats,
} from "@/lib/apiLinks/ticket";
import { toast } from "sonner";
import type { Ticket, User } from "@/types";

export function useUserDashboard(page: number) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const { tickets, totalPages, total } = await GetMyTickets(page);
      setTickets(tickets);
      setTotalPages(totalPages);
      setTotal(total);
    } catch (error) {
      toast.error("Error", { description: "Failed to fetch tickets" });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await GetDashbordStats();
      setStats(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleDeleteTicket = async (id: number) => {
    try {
      await DeleteTicket(id);
      toast.success("Deleted", { description: "Ticket deleted!!" });
      setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
    } catch (error) {
      toast.error("Error", { description: "Failed to delete tickets" });
    }
  };

  const handleTicketUpdated = () => {
    fetchTickets();
  };

  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailsModalOpen(true);
  };

  return {
    tickets,
    loading,
    stats,
    error,
    total,
    totalPages,
    selectedTicket,
    setSelectedTicket,
    detailsModalOpen,
    setDetailsModalOpen,
    editModalOpen,
    setEditModalOpen,
    handleDeleteTicket,
    handleTicketUpdated,
    handleEdit,
    handleTicketClick,
    fetchTickets,
  };
}
