"use client";

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/konto");
    }
  }, [router, status]);

  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <GoogleLoginButton />
    </main>
  );
}
