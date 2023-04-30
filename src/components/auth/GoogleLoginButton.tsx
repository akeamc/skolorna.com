"use client";

import { useEffect, useRef } from "react";
import { useGoogle } from "./GoogleContext";

export default function GoogleLoginButton() {
  const container = useRef<HTMLDivElement>(null);
  const { initialized } = useGoogle();

  useEffect(() => {
    if (!initialized || !container.current) return;
    console.log("rendering button");
    google.accounts.id.renderButton(container.current, {
      type: "standard",
      size: "large",
      text: "continue_with",
    });
  }, [initialized]);

  return <div ref={container} />;
}
