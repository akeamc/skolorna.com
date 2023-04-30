"use client";

import { FunctionComponent, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Menu, X } from "react-feather";
import Link from "next/link";
import BigSearch from "./oden/BigSearch";
import { useAuth } from "@/lib/auth/context";
import useProfile from "@/lib/auth/useProfile";

const Logo: FunctionComponent = () => (
  <Link href="/" className="-m-1.5 p-1.5">
    <span className="sr-only">Skolorna</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 237.86041 270.93334"
      version="1.1"
      className="w-6"
    >
      <g>
        <path d="M 79.48108,7.6835053e-4 C 48.856777,-0.08761401 38.138554,7.4457498 22.501249,26.780801 2.8779643,51.044395 -1.2536397,83.051909 0.29556668,109.89674 1.8447741,136.74156 22.501289,176.49228 40.575367,199.20713 c 18.074078,22.71485 43.893994,49.55972 61.451683,60.4009 17.55767,10.84118 34.59887,12.90633 52.67295,10.32511 18.07407,-2.58122 22.13705,-7.10281 37.61592,-22.23154 26.69212,-26.08832 36.22942,-45.39699 36.22942,-45.39699 0,0 9.81179,-11.87332 9.29538,-22.71452 -0.51639,-10.84117 -7.22968,-24.26396 -5.68045,-31.49141 1.5492,-7.22744 3.09864,-21.68222 0.51664,-28.39342 C 230.09489,112.99405 215.63552,80.986902 197.56144,60.33703 179.48735,39.687163 160.38027,6.1310891 107.19086,1.4848708 96.386756,0.54110746 87.287274,0.02329719 79.48108,7.6835053e-4 Z M 87.464949,68.936551 c 8.655792,0.06352 20.177981,3.338524 26.955761,7.403963 7.74603,4.646229 4.64769,17.036151 4.64769,17.036151 0,0 -3.61512,12.390095 -5.16433,18.068815 -1.5492,5.67871 -9.8115,10.84119 -9.8115,10.84119 0,0 -3.09815,1.03248 -6.196566,3.09749 -3.098419,2.06498 -12.393862,3.09713 -13.94307,-3.61409 -1.549197,-6.71119 -9.811567,-10.84099 -14.459189,-14.45474 -4.647622,-3.61371 -8.778948,-14.97117 -3.614926,-26.328592 5.164023,-11.35743 9.295286,-10.841358 18.074115,-11.873855 1.097356,-0.12906 2.275473,-0.185408 3.512015,-0.176332 z" />
      </g>
    </svg>
  </Link>
);

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userId, status } = useAuth();
  const { data: profile } = useProfile(userId || undefined);

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex">
          <Logo />
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
            <Logo />

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
