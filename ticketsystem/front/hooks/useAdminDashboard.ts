import { useEffect, useMemo, useState } from "react";
import type {
  FilterState,
  Notification,
  Priority,
  Status,
  Ticket,
  User,
} from "@/types";
import { GetDashbordStats, GetTickets } from "@/lib/apiLinks/ticket";
import { toast } from "sonner";

export function useAdminDashboard(user: User) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [filters, setFilters] = useState<FilterState>({
    status: "ALL",
    priority: "ALL",
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTickets();
  }, [page]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { tickets, totalPages, total } = await GetTickets(page);
      setTickets(tickets);
      setTotalPages(totalPages);
      setTotal(total);
    } catch (err) {
      toast.error("Error", { description: "Failed to fetch tickets" });
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
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    if (key === "status" || key === "priority") {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    }
  };

  const handleClearFilters = () => {
    setFilters({ status: "ALL", priority: "ALL" });
    setPage(1);
  };

  const handleAssignTicket = async (ticketId: string, assignedToId: string) => {
    try {
      await fetchTickets();
    } catch (error) {
      toast.error("Error", { description: "Failed to assign ticket" });
    }
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

  return {
    tickets: filteredTickets,
    stats,
    loading,
    error,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    handleFilterChange,
    handleClearFilters,
    selectedTicket,
    setSelectedTicket,
    notification,
    setNotification,
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
  };
}
