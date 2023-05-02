"use client";

import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";
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
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex w-96 flex-col items-center p-4">
        {status === "unauthenticated" ? (
          <>
            <Logo className="mb-8 h-8" />
            <GoogleLoginButton />
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </main>
  );
}
