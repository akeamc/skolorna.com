import {
  errorToString,
  useCredentials,
  useCredentialsMutation,
} from "@/lib/schedule/hooks";
import { FormEvent, FunctionComponent, useId, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { Lock } from "react-feather";
import { DateTime } from "luxon";
import Spinner from "../Spinner";
import Modal from "../Modal";
import { useRouter } from "next/navigation";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Login: FunctionComponent<ModalProps> = ({ open, setOpen }) => {
  const usernameId = useId();
  const passwordId = useId();
  const { mutate, isPending, error } = useCredentialsMutation({
    onSuccess: () => setOpen(false),
  });
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    mutate({
      service: "skolplattformen",
      username: data.get("username") as string,
      password: data.get("password") as string,
    });
  }

  function passedSetOpen(open: boolean) {
    if (open) {
      setOpen(open);
    } else {
      router.back();
    }
  }

  return (
    <Modal open={open} setOpen={passedSetOpen}>
      <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <Dialog.Title
          as="h3"
          className="mb-3 mr-6 text-base font-semibold leading-6 text-gray-900"
        >
          Anslut till Skolplattformen
        </Dialog.Title>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                name="username"
                type="text"
                required
                placeholder="ab12345"
                className="block w-full rounded-md border-0 py-1.5 font-mono text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
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

          {error && (
            <div className="text-sm font-medium text-red-600">
              {errorToString(error)}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={isPending}
            >
              Anslut
              {isPending && <Spinner className="ml-2" currentColor />}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

const Deletion: FunctionComponent<ModalProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const cancelButtonRef = useRef(null);
  const { data: credentials } = useCredentials();
  const { mutate, isPending } = useCredentialsMutation({
    onSuccess: () => {
      setOpen(false);
      router.push("/");
    },
  });

  return (
    <Modal open={open} setOpen={setOpen} initialFocus={cancelButtonRef}>
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <Lock className="h-6 w-6 text-red-600" aria-hidden="true" />
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
                  ? DateTime.fromISO(credentials.updated_at).toLocaleString(
                      DateTime.DATETIME_MED,
                      {
                        locale: "sv",
                      }
                    )
                  : undefined}
              </time>
              . Det innebär att dina inloggningsuppgifter lagras på våra
              servrar.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
          onClick={() => mutate(null)}
          disabled={isPending}
        >
          Koppla ifrån
          {isPending && <Spinner className="ml-2" currentColor />}
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
    </Modal>
  );
};

export default function CredentialsModal(props: ModalProps) {
  const { data: credentials, isSuccess } = useCredentials();

  if (!isSuccess) {
    return (
      <Modal {...props}>
        <Spinner className="mx-auto my-32 w-4" />
      </Modal>
    );
  }

  if (credentials) {
    return <Deletion {...props} />;
  }

  return <Login {...props} />;
}
