"use client";

import { useAuth } from "@/lib/auth/context";
import Script from "next/script";
import { FunctionComponent, useEffect, useId, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const GoogleId: FunctionComponent = () => {
  const [initialized, setInitialized] = useState(false);
  const parentId = useId();
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
      prompt_parent_id: parentId,
    });

    setInitialized(true);
  };

  useEffect(() => {
    if (initialized && status === "unauthenticated")
      google.accounts.id.prompt();
  }, [initialized, status]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={onLoad}
      />
      <div id={parentId} />
    </>
  );
};

export default GoogleId;
