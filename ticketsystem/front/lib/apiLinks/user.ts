import { User } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetProfile = async () => {
  const res = await fetch(`${API_URL}/api`);
};

export const GetDev = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/api/user/dev`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch developers");
  }

  const data = await res.json();
  return data.devs;
};

export const GetCurrentUser = async (): Promise<User> => {
  const res = await fetch(`${API_URL}/api/user/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch user");
  const data = await res.json();
  return data.user;
};

export const UpdateProfile = async ({
  id,
  email,
  fullName,
}: {
  id: Number;
  email: string;
  fullName: string;
}) => {
  const res = await fetch(`${API_URL}/api/user/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, fullName }),
  });

  if (!res.ok) {
    throw new Error("Profile Updating failed");
  }
  const data = await res.json();
  return data.ticket;
};
