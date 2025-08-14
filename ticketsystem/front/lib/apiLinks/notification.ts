export const API_URL = process.env.NEXT_PUBLIC_API_URL;

let csrfToken: string | null = null;

// Récupère le CSRF token depuis le backend
export const getCsrfToken = async () => {
  const res = await fetch(`${API_URL}/api/csrf-token`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Impossible de récupérer le token CSRF");
  const data = await res.json();
  csrfToken = data.csrfToken;
};

export const SendNotification = async (
  title: string,
  message: string,
  type: string,
  ticketId: string,
  recipientType?: "CLIENT" | "DEV"
) => {
  if (!csrfToken) await getCsrfToken();

  const res = await fetch(`${API_URL}/api/notification`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-csrf-token": csrfToken as string,
    },
    body: JSON.stringify({ title, message, type, ticketId, recipientType }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("error occurs when sending notification");
  }
  const data = await res.json();
  return data;
};

export const GetNotification = async () => {
  const res = await fetch(`${API_URL}/api/notification`, {
    method: "GET",
    credentials: "include",
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error("Error occurs when getting the not");
  }

  const data = await res.json();
  return data.notifications;
};

export const MarkNotificationAsRead = async (id: string) => {
  if (!csrfToken) await getCsrfToken();

  await fetch(`${API_URL}/api/notification/${id}/read`, {
    method: "PATCH",
    credentials: "include",
    headers: { "x-csrf-token": csrfToken as string },
  });
};

export const MarkAllNotificationsAsRead = async () => {
  if (!csrfToken) await getCsrfToken();

  await fetch(`${API_URL}/api/notification/read-all`, {
    method: "PATCH",
    credentials: "include",
    headers: { "x-csrf-token": csrfToken as string },
  });
};
