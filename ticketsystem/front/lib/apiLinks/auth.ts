export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signUp = async (
  fullName: string,
  email: string,

  password: string
) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });

  if (!res.ok) {
    throw new Error(" Error within the process");
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
    headers: { "content-type": "application/json" },
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
