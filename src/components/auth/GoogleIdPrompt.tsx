"use client";

import { useEffect } from "react";
import { useGoogle } from "./GoogleContext";
import { useAuth } from "@/lib/auth/context";

export default function GoogleIdPrompt() {
  const { status, justLoggedOut } = useAuth();
  const { initialized, promptParentId } = useGoogle();

  useEffect(() => {
    if (status === "unauthenticated" && initialized && !justLoggedOut) {
      google.accounts.id.prompt();
    }
  }, [initialized, status, justLoggedOut]);

  return <div className="fixed right-0 top-20 z-20" id={promptParentId} />;
}
