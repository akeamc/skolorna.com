"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Menu, X } from "react-feather";
import Link from "next/link";
import BigSearch from "./oden/BigSearch";
import { useAuth } from "@/lib/auth/context";
import useProfile from "@/lib/auth/useProfile";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

const LogoLink: FunctionComponent = () => (
  <Link href="/" className="-m-1.5 p-1.5">
    <Logo className="h-6" />
  </Link>
);

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userId, status } = useAuth();
  const { data: profile } = useProfile(userId || undefined);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex">
          <LogoLink />
        </div>
        <BigSearch className="mx-4 grow lg:mx-12" />
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Öppna huvudmenyn</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden text-sm font-semibold leading-6 text-gray-900 lg:flex lg:gap-x-12">
          <Link href="/schema">Schema</Link>
          <Link
            href={status === "authenticated" ? "/konto" : "/login"}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            {profile ? (
              profile.full_name
            ) : (
              <>
                Logga in <span aria-hidden="true">-&gt;</span>
              </>
            )}
          </Link>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <LogoLink />

            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  href="/schema"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Schema
                </Link>
              </div>
              <div className="py-6">
                <Link
                  href={status === "authenticated" ? "/konto" : "/login"}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {profile ? (
                    profile.full_name
                  ) : (
                    <>
                      Logga in <span aria-hidden="true">-&gt;</span>
                    </>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
