export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "UNOPEN" | "OPEN" | "IN_PROGRESS" | "RESOLVED";

export type Role = "ADMIN" | "CLIENT" | "DEV";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

interface Dev {
  id: number;
  fullName: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  projectName: string;
  assignedDev: {
    id: number;
    email: string;
    role: Role;
    fullName: string;
  } | null;
  client: {
    id: number;
    fullName: string;
  };
  assignedId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketWithDetails extends Ticket {
  project: Project;
  assignedTo: User;
  createdBy: User;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  ticketId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TicketFilters {
  status?: Status;
  priority?: Priority;
  projectId?: string;
  assignedToId?: string;
}
