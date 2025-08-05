"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { GetCurrentUser } from "@/lib/apiLinks/user";
import { NotificationsPage } from "@/components/notification-page";
import { HashLoader } from "react-spinners";

export default function Notifications() {
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

  return <NotificationsPage user={user} />;
}
