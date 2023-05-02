"use client";

import { Fragment, FunctionComponent, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Check, ChevronDown, MoreHorizontal } from "react-feather";
import { useSchedule } from "@/lib/schedule/context";
import classNames from "classnames";
import { DateTime } from "luxon";
import Scroller from "../Scroller";
import { useClasses } from "@/lib/schedule/hooks";
import { View } from "@/lib/schedule";

const LABELS: Record<View, string> = {
  month: "Månad",
  week: "Vecka",
  day: "Dag",
};

const MenuItem: FunctionComponent<{
  children: ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => (
  <Menu.Item>
    {({ active }) => (
      <button
        onClick={onClick}
        className={classNames(
          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
          "flex w-full items-center px-4 py-2 text-left text-sm"
        )}
      >
        {children}
      </button>
    )}
  </Menu.Item>
);

const DropdownMenu: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">{children}</div>
    </Menu.Items>
  </Transition>
);

function ViewDropdown() {
  const { view, setView } = useSchedule();

  return (
    <Menu as="div" className="relative inline-block text-left max-sm:hidden">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold  text-gray-900 shadow-sm hover:bg-gray-50">
          {LABELS[view] || view}
          <ChevronDown
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <DropdownMenu>
        {Object.entries(LABELS).map(([key, label]) => (
          <MenuItem key={key} onClick={() => setView(key as View)}>
            {label}
            {key === view && <Check className="ml-auto h-4 w-4" />}
          </MenuItem>
        ))}
      </DropdownMenu>
    </Menu>
  );
}

function Options() {
  const { view, setView, setCursor } = useSchedule();

  return (
    <Menu as="div" className="relative inline-block text-left sm:hidden">
      <div>
        <Menu.Button className="inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:text-gray-900">
          <MoreHorizontal className="h-5 w-5" aria-label="Alternativ" />
        </Menu.Button>
      </div>
      <DropdownMenu>
        <MenuItem key="today" onClick={() => setCursor(DateTime.now())}>
          Idag
        </MenuItem>
        <hr className="my-1" />
        {Object.entries(LABELS).map(([key, label]) => (
          <MenuItem key={key} onClick={() => setView(key as View)}>
            {label}
            {key === view && <Check className="ml-auto h-4 w-4" />}
          </MenuItem>
        ))}
      </DropdownMenu>
    </Menu>
  );
}

const HEADING_DATE_FORMAT: Record<View, Intl.DateTimeFormatOptions> = {
  month: { month: "long", year: "numeric" },
  week: { month: "long", year: "numeric" },
  day: { month: "long", day: "numeric", year: "numeric" },
};

export default function CalendarHeader() {
  useClasses();
  const { cursor, setCursor, view } = useSchedule();
  let subheading;
  switch (view) {
    case "week":
      subheading = `Vecka ${cursor.weekNumber}`;
      break;
    case "day":
      subheading = cursor.toLocaleString({ weekday: "long" }, { locale: "sv" });
      break;
  }

  return (
    <header className="mb-2 flex h-12 items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">
          {cursor.toLocaleString(HEADING_DATE_FORMAT[view], { locale: "sv" })}
        </h1>
        {subheading && <h2 className="text-sm text-gray-500">{subheading}</h2>}
      </div>
      <div className="flex items-center gap-2">
        <Scroller
          onScroll={(steps) => setCursor(cursor.plus({ [view]: steps }))}
          onReset={() => setCursor(DateTime.now())}
        />
        <ViewDropdown />
        <Options />
      </div>
    </header>
  );
}
