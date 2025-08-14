import { useState, useEffect } from "react";
import { GetMyTickets, UpdateStatus } from "@/lib/apiLinks/ticket";
import { toast } from "sonner";
import type { Ticket, Status } from "@/types";

export function useTickets(userId: string, page: number) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { tickets, totalPages, total } = await GetMyTickets(page);
      setTickets(tickets);
      setTotalPages(totalPages);
      setTotal(total);
    } catch {
      toast.error("Error fetching tickets");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (ticketId: string, status: Status) => {
    try {
      await UpdateStatus(ticketId, status);
      toast.success("Ticket status updated");
      fetchTickets();
    } catch {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page]);

  return { tickets, total, totalPages, loading, fetchTickets, updateStatus };
}
