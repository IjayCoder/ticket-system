import type {
  User,
  Project,
  Ticket,
  TicketWithDetails,
  Notification,
} from "@/types";

/*export const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Dev" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "Dev" },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
  },
  { id: "6", name: "Diana Prince", email: "diana@example.com", role: "Dev" },
];*/

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Web Application",
    description: "Main web application project",
  },
  {
    id: "2",
    name: "Mobile App",
    description: "iOS and Android mobile application",
  },
  { id: "3", name: "API Service", description: "Backend API service" },
  { id: "4", name: "Dashboard", description: "Admin dashboard project" },
];

/*export const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Login page not responsive on mobile",
    description:
      "The login form breaks on screens smaller than 768px. Need to fix responsive design.",
    priority: "High",
    status: "Open",
    projectId: "1",
    assignedToId: "3", // Assigned to Bob (Dev)
    createdById: "2", // Jane (User) created this
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "API endpoint returns 500 error",
    description:
      "The /api/users endpoint is throwing internal server errors when fetching user data.",
    priority: "High",
    status: "In Progress",
    projectId: "3",
    assignedToId: "4", // Assigned to Alice (Dev)
    createdById: "5", // Charlie (User) created this
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "3",
    title: "Add dark mode toggle",
    description:
      "Users have requested a dark mode option for better accessibility.",
    priority: "Medium",
    status: "Open",
    projectId: "1",
    assignedToId: "6", // Assigned to Diana (Dev)
    createdById: "2", // Jane (User) created this
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
  },
  {
    id: "4",
    title: "Dashboard charts not loading",
    description:
      "The analytics charts on the dashboard are not rendering properly.",
    priority: "Medium",
    status: "Resolved",
    projectId: "4",
    assignedToId: "3", // Assigned to Bob (Dev)
    createdById: "5", // Charlie (User) created this
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-17T13:30:00Z",
  },
  {
    id: "5",
    title: "Update user profile validation",
    description:
      "Email validation is too strict and rejecting valid email addresses.",
    priority: "Low",
    status: "Open",
    projectId: "1",
    assignedToId: "4", // Assigned to Alice (Dev)
    createdById: "2", // Jane (User) created this
    createdAt: "2024-01-11T09:15:00Z",
    updatedAt: "2024-01-11T09:15:00Z",
  },
  {
    id: "6",
    title: "Mobile app crashes on startup",
    description: "App crashes immediately after launch on iOS 17.2 devices.",
    priority: "High",
    status: "In Progress",
    projectId: "2",
    assignedToId: "6", // Assigned to Diana (Dev)
    createdById: "5", // Charlie (User) created this
    createdAt: "2024-01-10T13:20:00Z",
    updatedAt: "2024-01-16T10:45:00Z",
  },
];*/

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "3", // Bob (Dev)
    title: "New ticket assigned",
    message:
      "You have been assigned to ticket: Login page not responsive on mobile",
    type: "info",
    ticketId: "1",
    isRead: false,
    createdAt: "2024-01-15T10:35:00Z",
  },
  {
    id: "2",
    userId: "4", // Alice (Dev)
    title: "Ticket priority updated",
    message:
      "The priority of 'API endpoint returns 500 error' has been changed to High",
    type: "warning",
    ticketId: "2",
    isRead: false,
    createdAt: "2024-01-16T09:20:00Z",
  },
  {
    id: "3",
    userId: "2", // Jane (User)
    title: "Ticket resolved",
    message: "Your ticket 'Dashboard charts not loading' has been resolved",
    type: "success",
    ticketId: "4",
    isRead: true,
    createdAt: "2024-01-17T13:35:00Z",
  },
];

/*export function getTicketsWithDetails(): TicketWithDetails[] {
  return mockTickets.map((ticket) => ({
    ...ticket,
    project: mockProjects.find((p) => p.id === ticket.projectId)!,
    assignedTo: mockUsers.find((u) => u.id === ticket.assignedToId)!,
    createdBy: mockUsers.find((u) => u.id === ticket.createdById)!,
  }));
}*/

export function getNotificationsByUserId(userId: string): Notification[] {
  return mockNotifications.filter(
    (notification) => notification.userId === userId
  );
}

// Current user for demo purposes
//export const currentUser: User = mockUsers[0]; // John Doe (Admin)
