"use client";

import { useCredentials } from "@/lib/schedule/hooks";
import { useEffect, useState } from "react";
import CredentialsModal from "./CredentialsModal";
// import { Share } from "react-feather";
// import ShareModal from "./ShareModal";

export default function Footer() {
  const { data: credentials, isSuccess } = useCredentials();
  const [credentialsModal, setCredentialsModal] = useState(false);
  // const [shareModal, setShareModal] = useState(false);

  useEffect(() => {
    if (isSuccess && !credentials) setCredentialsModal(true);
  }, [isSuccess, credentials]);

  return (
    <footer className="my-8 flex items-center justify-between">
      <CredentialsModal open={credentialsModal} setOpen={setCredentialsModal} />
      {/* <ShareModal open={shareModal} setOpen={setShareModal} /> */}
      <div>
        <p className="text-sm text-gray-500">
          Ansluten till{" "}
          <code className="rounded-sm border bg-gray-100 px-1 py-0.5 text-[80%] leading-none">
            {credentials?.username}
          </code>{" "}
          på ✨Skolplattformen✨
        </p>
        <button
          className="mt-2 text-sm text-gray-500 underline"
          onClick={() => setCredentialsModal(true)}
        >
          Hantera anslutning
        </button>
      </div>
      {/* <button className="text-gray-500 flex" title="Dela" onClick={() => setShareModal(true)}>
        <Share className="w-5 h-5" />
      </button> */}
    </footer>
  );
}
