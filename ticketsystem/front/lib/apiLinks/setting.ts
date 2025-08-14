export const API_URL = process.env.NEXT_PUBLIC_API_URL;

/*let csrfToken: string | null = null;

// Récupère le CSRF token depuis le backend
export const getCsrfToken = async () => {
  const res = await fetch(`${API_URL}/api/csrf-token`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Impossible de récupérer le token CSRF");
  const data = await res.json();
  csrfToken = data.csrfToken;
};*/

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
  //  if (!csrfToken) await getCsrfToken();

  const res = await fetch(`${API_URL}/api/settings`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur mise à jour settings");
  return res.json();
};
