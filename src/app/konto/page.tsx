"use client";

import { useAuth } from "@/lib/auth/context";
import withAuth from "@/lib/auth/withAuth";

const Account = () => {
  const { logout } = useAuth();

  return (
    <div>
      <button onClick={logout}>Logga ut</button>
    </div>
  );
};

export default withAuth(Account);
