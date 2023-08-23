import { Dialog } from "@headlessui/react";
import Modal, { ModalProps } from "../Modal";
import { useQuery } from "@tanstack/react-query";
import { getScheduleLink } from "@/lib/schedule/client";
import { FunctionComponent, useState } from "react";

const CopyUrl: FunctionComponent<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const [timeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);

  function onClick() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    if (timeout) clearTimeout(timeout);
    setCopiedTimeout(setTimeout(() => setCopied(false), 2000));
  }

  return (
    <button
      className="relative flex w-full cursor-pointer overflow-hidden rounded-lg border p-1 pl-2 hover:bg-blue-50 active:bg-blue-100"
      onClick={onClick}
    >
      <div className="my-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-700 underline">
        {value}
      </div>
      <div className="flex items-center rounded-md bg-blue-600 px-2 text-xs font-medium text-white">
        {copied ? "Kopierad!" : "Kopiera"}
      </div>
    </button>
  );
};

export default function ShareModal(props: Omit<ModalProps, "initialFocus">) {
  const { data } = useQuery({
    queryKey: ["skool", "schedule", "link"],
    queryFn: getScheduleLink,
  });

  return (
    <Modal {...props}>
      <div className="bg-white px-4 pb-4 pt-5 text-sm sm:p-6 sm:pb-4">
        <Dialog.Title
          as="h3"
          className="mb-3 mr-6 text-base font-semibold leading-6 text-gray-900"
        >
          Synkronisera med kalender
        </Dialog.Title>
        <p className="mb-2">
          Håll din kalender uppdaterad med skolschemat. Nedanstående länk
          genererar en kalenderfil som kan läsas av de flesta kalenderappar.
        </p>
        <ol className="mb-2 list-decimal space-y-1 pl-5">
          <li>
            Öppna{" "}
            <a
              target="_blank"
              href="https://calendar.google.com/"
              className="text-blue-700 underline"
            >
              Google Kalender
            </a>{" "}
            <b>på datorn</b>.
          </li>
          <li>
            Klicka på kugghjulet högst upp. Gå till Inställningar -&gt; Lägg
            till kalender -&gt; Från webbadress.
          </li>
          <li>Klistra in länken i fältet &quot;Kalenderns webbadress&quot;.</li>
          <li>
            Om du vill att kalendern ska synas på mobilen måste du aktivera
            synkronisering i mobilappen.
          </li>
        </ol>
        {data && <CopyUrl value={data.icalUrl()} />}
        <p className="mt-1 text-xs text-gray-700">
          Länken kan användas för att stjäla ditt schema; skicka den inte till
          vem som helst.
        </p>
      </div>
    </Modal>
  );
}
