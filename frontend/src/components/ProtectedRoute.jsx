"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "../utils/auth";

function ProtectedRoute({ children }) {
  const router = useRouter();
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);
  if (!isAdminLoggedIn()) return null;
  return children;
}

export default ProtectedRoute;

