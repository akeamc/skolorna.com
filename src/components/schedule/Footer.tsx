"use client";

import { useCredentials } from "@/lib/schedule/hooks";
import { useEffect, useState } from "react";
import CredentialsModal from "./CredentialsModal";

export default function Footer() {
  const { data: credentials, isSuccess } = useCredentials();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSuccess && !credentials) setOpen(true);
  }, [isSuccess, credentials]);

  return (
    <footer className="my-8">
      <CredentialsModal open={open} setOpen={setOpen} />
      <p className="text-sm text-gray-500">
        Ansluten till{" "}
        <code className="rounded-sm border bg-gray-100 px-1 py-0.5 text-[80%] leading-none">
          {credentials?.username}
        </code>{" "}
        på ✨Skolplattformen✨
      </p>
      <button
        className="mt-2 text-sm text-gray-500 underline"
        onClick={() => setOpen(true)}
      >
        Hantera anslutning
      </button>
    </footer>
  );
}
