"use client";

import { useAuth } from "@/lib/auth/context";
import useProfile from "@/lib/auth/useProfile";
import withAuth from "@/lib/auth/withAuth";

const Account = () => {
  const { logout, userId } = useAuth();
  const { data: profile } = useProfile(userId || undefined);

  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <div className="my-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Konto
        </h1>
      </div>
      <section>
        <p className="mb-4">Inloggad som {profile?.full_name}.</p>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none ring-blue-700 ring-offset-2 hover:bg-blue-700 focus-visible:ring-2"
          onClick={logout}
        >
          Logga ut
        </button>
      </section>
    </main>
  );
};

export default withAuth(Account);
