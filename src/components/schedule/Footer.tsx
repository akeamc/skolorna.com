"use client";

import { useCredentials } from "@/lib/schedule/hooks";
import { useEffect, useState } from "react";
import CredentialsModal from "./CredentialsModal";
import ShareModal from "./ShareModal";

export default function Footer() {
  const { data: credentials, isSuccess } = useCredentials();
  const [credentialsModal, setCredentialsModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);

  useEffect(() => {
    if (isSuccess && !credentials) setCredentialsModal(true);
  }, [isSuccess, credentials]);

  return (
    <footer className="my-4 flex items-center justify-between">
      <CredentialsModal open={credentialsModal} setOpen={setCredentialsModal} />
      <ShareModal open={shareModal} setOpen={setShareModal} />
      <div>
        <p className="text-sm text-gray-500">
          Ansluten till{" "}
          <code className="rounded-sm border bg-gray-100 px-1 py-0.5 text-[80%] leading-none">
            {credentials?.username}
          </code>{" "}
          på ✨Skolplattformen✨
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <button
            className="underline"
            onClick={() => setCredentialsModal(true)}
          >
            Hantera anslutning
          </button>
          <span className="mx-2">·</span>
          <button onClick={() => setShareModal(true)}>
            <span className="underline">Synkronisera med kalender</span>
            <span className="ml-1 rounded-sm bg-blue-600 px-1 py-0.5 text-xs font-medium uppercase text-white">
              Ny
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
