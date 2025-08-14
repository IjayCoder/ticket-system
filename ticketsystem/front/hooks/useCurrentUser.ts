"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetCurrentUser } from "@/lib/apiLinks/user";
import { User } from "@/types";
import { toast } from "sonner";

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await GetCurrentUser();
        if (!data) {
          router.push("/login");
          return;
        }
        setUser(data);
      } catch (err) {
        toast.error("Error", {
          description: "Error occurs when getting users",
        });
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, loading };
};
