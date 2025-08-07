export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetSettings = async () => {
  const res = await fetch(`${API_URL}/api/settings`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur récupération settings");
  return res.json();
};

export const UpdateSettings = async (data: {
  receiveNotificationsEmail?: boolean;
  receiveTicketUpdateNotification?: boolean;
}) => {
  const res = await fetch(`${API_URL}/api/settings`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur mise à jour settings");
  return res.json();
};
