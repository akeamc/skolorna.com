"use client";

import { useAuth } from "@/lib/auth/context";
import withAuth from "@/lib/auth/withAuth";

const Account = () => {
  const { logout } = useAuth();

  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <button onClick={logout}>Logga ut</button>
    </main>
  );
};

export default withAuth(Account);
