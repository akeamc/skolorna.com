"use client";

import { useAuth } from "@/lib/auth/context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirecter() {
  const router = useRouter();
  const { status } = useAuth();
  const path = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?next=${encodeURIComponent(path)}`);
    }
  });

  return null;
}
