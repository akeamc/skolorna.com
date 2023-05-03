"use client";

import { useCredentials, useCredentialsMutation } from "@/lib/schedule/hooks";
import { Fragment, FunctionComponent, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Lock, X } from "react-feather";
import { DateTime } from "luxon";

const Modal: FunctionComponent<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const cancelButtonRef = useRef(null);
  const { data: credentials } = useCredentials();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-900 focus-visible:ring-blue-700"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Lock
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="mb-3 mr-6 text-base font-semibold leading-6 text-gray-900"
                      >
                        Hantera anslutning till Skolplattformen
                      </Dialog.Title>
                      {credentials ? (
                        <p className="text-sm">
                          Ditt Skolorna-konto är anslutet till{" "}
                          <code className="rounded-sm border bg-gray-100 px-1 py-0.5 text-[80%] leading-none">
                            {credentials.username}
                          </code>{" "}
                          sedan{" "}
                          <time>
                            {DateTime.fromISO(
                              credentials.updated_at
                            ).toLocaleString(DateTime.DATETIME_MED, {
                              locale: "sv",
                            })}
                          </time>
                          . Det innebär att dina inloggningsuppgifter lagras på
                          våra servrar.
                        </p>
                      ) : (
                        <p>Inte ansluten till Skolplattformen.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Koppla ifrån
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Stäng
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default function Footer() {
  const { data: credentials } = useCredentials();
  const { mutate } = useCredentialsMutation();
  const [open, setOpen] = useState(false);

  return (
    <footer className="my-8">
      <Modal open={open} setOpen={setOpen} />
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
