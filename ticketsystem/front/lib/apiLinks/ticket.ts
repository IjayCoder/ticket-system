import { Priority, Ticket } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const CreateTicket = async (
  title: string,
  description: string,
  priority: Priority,
  projectName: string,
  assignedDevId: string,
  clientId: string
) => {
  const res = await fetch(`${API_URL}/api/ticket`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      priority,
      projectName,
      assignedDevId,
      clientId,
    }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(" Error when creating a ticket");
  }

  const data = await res.json();
  return data;
};

export const GetTickets = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_URL}/api/ticket?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Error when getting the tickets");
  }

  const data = await res.json();
  return {
    tickets: data.tickets,
    totalPages: data.totalPages,
    total: data.total,
    page: data.page,
  };
};

export const GetMyTickets = async (page = 1, limit = 10) => {
  const res = await fetch(
    `${API_URL}/api/ticket/user?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(" Error when getting the tickets");
  }

  const data = await res.json();
  return {
    tickets: data.tickets,
    totalPages: data.totalPages,
    total: data.total,
    page: data.page,
  };
};

export const GetTicketById = async (id: string): Promise<Ticket> => {
  const res = await fetch(`${API_URL}/api/ticket/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(" Error when getting the tickets");
  }

  const data = await res.json();
  return data.ticket;
};

export const UpdateTicket = async ({
  id,
  title,
  description,
  priority,
  projectName,
  assignedDev,
  clientId,
}: {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  projectName: string;
  assignedDev: string;
  clientId: string;
}) => {
  const res = await fetch(`${API_URL}/api/ticket/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      priority,
      projectName,
      assignedDevId: assignedDev,
      clientId,
    }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(" Error when updating the ticket");
  }

  const data = await res.json();
  return data.ticket;
};

export const UpdateStatus = async (id: string, status: string) => {
  const res = await fetch(`${API_URL}/api/ticket/status/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update");
  }

  return res.json();
};

export const DeleteTicket = async (
  id: string
): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/api/ticket/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(" Ticket deletion failed");
  }

  const data = await res.json();
  return data;
};

export const GetDashbordStats = async () => {
  const res = await fetch(`${API_URL}/api/ticket/stats`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Error when getting the stats");
  }

  const data = await res.json();
  return data.stats;
};

export const getFilteredTickets = async (type: "priority" | "status") => {
  const res = await fetch(`${API_URL}/api/ticket/${type}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Error when getting tickets by ${type}`);
  }

  return await res.json();
};
