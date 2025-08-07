// hooks/useLogin.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Login } from "@/lib/apiLinks/auth";

export const useLogin = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      await Login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
};
