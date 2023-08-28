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
    <main className="main">
      <div className="my-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Konto
        </h1>
      </div>
      <section>
        <p className="mb-4">
          Inloggad som {account?.name} ({account?.email}).
        </p>
        <button
          type="button"
          className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          onClick={onLogoutClick}
        >
          Logga ut
        </button>
      </section>
    </main>
  );
}
