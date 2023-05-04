"use client";

import { useCredentials, useCredentialsMutation } from "@/lib/schedule/hooks";
import { Fragment, FunctionComponent, useId, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Lock, X } from "react-feather";
import { DateTime } from "luxon";
import Spinner from "../Spinner";

const LoginModal: FunctionComponent<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const usernameId = useId();
  const passwordId = useId();

  return (
    <div className="mt-10 w-full">
      <form className="space-y-6">
        <div>
          <label
            htmlFor={usernameId}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Användarnamn
          </label>
          <div className="mt-2">
            <input
              id={usernameId}
              name="text"
              type="text"
              required
              placeholder="ab12345"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={passwordId}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Lösenord
          </label>
          <div className="mt-2">
            <input
              id={passwordId}
              name="password"
              type="password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Anslut
          </button>
        </div>
      </form>
      {/* 
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Start a 14 day free trial
            </a>
          </p> */}
    </div>
  );
};

const DeletionModal: FunctionComponent<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const cancelButtonRef = useRef(null);
  const { data: credentials } = useCredentials();
  const { mutate, status } = useCredentialsMutation();

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
                    <div className="mt-3 grow text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="mb-3 mr-6 text-base font-semibold leading-6 text-gray-900"
                      >
                        Hantera anslutning till Skolplattformen
                      </Dialog.Title>
                      <p className="text-sm">
                        Ditt Skolorna-konto är anslutet till{" "}
                        <code className="rounded-sm border bg-gray-100 px-1 py-0.5 text-[80%] leading-none">
                          {credentials?.username}
                        </code>{" "}
                        sedan{" "}
                        <time>
                          {credentials
                            ? DateTime.fromISO(
                                credentials.updated_at
                              ).toLocaleString(DateTime.DATETIME_MED, {
                                locale: "sv",
                              })
                            : undefined}
                        </time>
                        . Det innebär att dina inloggningsuppgifter lagras på
                        våra servrar. Om du kopplar ifrån ditt konto kommer dina
                        inloggningsuppgifter att raderas omedelbart.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => mutate(null)}
                    disabled={status === "pending"}
                  >
                    Koppla ifrån
                    {status === "pending" && (
                      <Spinner className="ml-2" currentColor />
                    )}
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

const Modal: FunctionComponent<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const { data: credentials } = useCredentials();

  if (!credentials) {
    return <LoginModal open={open} setOpen={setOpen} />;
  }

  return <DeletionModal open={open} setOpen={setOpen} />;
};

export default function Footer() {
  const { data: credentials } = useCredentials();
  const [open, setOpen] = useState(false);

  console.log(credentials);

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
