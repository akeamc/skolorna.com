"use client";

import { useAuth } from "@/lib/auth/context";
import { useAccount } from "@/lib/auth/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Account() {
  const { status, logout, justLoggedOut } = useAuth();
  const { data: account } = useAccount();
  const router = useRouter();
  const path = usePathname();

  function onLogoutClick() {
    router.push("/");
    logout();
  }

  useEffect(() => {
    if (status === "unauthenticated" && !justLoggedOut) {
      router.push(`/login?next=${encodeURIComponent(path)}`);
    }
  }, [status, router, path, justLoggedOut]);

  if (status !== "authenticated") {
    return null;
  }

  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <div className="my-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Konto
        </h1>
      </div>
      <section>
        <p className="mb-4">Inloggad som {account?.full_name}.</p>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none ring-blue-700 ring-offset-2 hover:bg-blue-700 focus-visible:ring-2"
          onClick={onLogoutClick}
        >
          Logga ut
        </button>
      </section>
    </main>
  );
}
