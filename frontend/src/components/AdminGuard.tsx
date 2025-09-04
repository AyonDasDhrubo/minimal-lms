"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin"); // simple admin token
    if (!isAdmin) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <p>Checking admin authentication...</p>;

  return <>{children}</>;
}
