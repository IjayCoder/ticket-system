"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { User } from "@/types";
import { GetCurrentUser } from "@/lib/apiLinks/user";
import { HashLoader } from "react-spinners";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
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
        console.error("Erreur récupération utilisateur", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  if (!user)
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <HashLoader size={50} />
        </div>
      </>
    );

  return <Dashboard user={user} />;
}
