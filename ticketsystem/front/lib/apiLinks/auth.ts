export const API_URL = process.env.NEXT_PUBLIC_API_URL;

//let csrfToken: string | null = null;

// Récupère le CSRF token depuis le backend
/*export const getCsrfToken = async () => {
  const res = await fetch(`${API_URL}/api/csrf-token`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Impossible de récupérer le token CSRF");
  const data = await res.json();
  csrfToken = data.csrfToken;
};*/

export const signUp = async (
  fullName: string,
  email: string,

  password: string
) => {
  //  if (!csrfToken) await getCsrfToken(); "x-csrf-token": csrfToken as string

  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",

    body: JSON.stringify({ fullName, email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur inconnue");
  }

  const data = await res.json();
  return data;
};

export const Login = async (
  email: string,

  password: string
) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(" Password or Email incorrect");
  }

  const data = await res.json();
  console.log(data);
  return data;
};

export const Logout = async () => {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Error occurs within the logout");
  }

  return await res.json();
};
