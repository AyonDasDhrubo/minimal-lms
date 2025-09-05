"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function UserGuard({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isUser = localStorage.getItem("isUser");
    if (!isUser) {
      router.push("/login-user"); // redirect if not logged in
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p>Checking authentication...</p>;
  return <>{children}</>;
}
