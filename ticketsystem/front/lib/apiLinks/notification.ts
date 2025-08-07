export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SendNotification = async (
  title: string,
  message: string,
  type: string,
  ticketId: number,
  recipientType?: "CLIENT" | "DEV"
) => {
  const res = await fetch(`${API_URL}/api/notification`, {
    method: "POST",
    headers: { "content-type": "application/json" },
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
  await fetch(`${API_URL}/api/notification/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });
};

export const MarkAllNotificationsAsRead = async () => {
  await fetch(`${API_URL}/api/notification/read-all`, {
    method: "PATCH",
    credentials: "include",
  });
};
