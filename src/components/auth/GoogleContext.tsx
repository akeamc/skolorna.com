"use client";

import { useAuth } from "@/lib/auth/context";
import Script from "next/script";
import { createContext, useContext, useId, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const GoogleContext = createContext<
  { initialized: boolean; promptParentId: string } | undefined
>(undefined);

export const GoogleProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const promptParentId = useId();
  const { authenticate, status } = useAuth();

  const onResponse = (res: any, nonce: string) => {
    authenticate({
      grant_type: "id_token",
      provider: "google",
      id_token: res.credential,
      nonce,
    });
  };

  const onLoad = () => {
    if (!CLIENT_ID) throw new Error("Missing Google Client ID");

    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (res) => onResponse(res, nonce),
      nonce,
      prompt_parent_id: promptParentId,
    });

    setInitialized(true);
  };

  return (
    <GoogleContext.Provider value={{ initialized, promptParentId }}>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={onLoad}
      />
      {children}
    </GoogleContext.Provider>
  );
};

export function useGoogle() {
  const context = useContext(GoogleContext);
  if (context === undefined) {
    throw new Error("useGoogle must be used within a GoogleProvider");
  }
  return context;
}
