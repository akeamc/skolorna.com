"use client";

import { Fragment, FunctionComponent, Key, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "react-feather";
import { View, useSchedule } from "@/lib/schedule/context";
import classNames from "classnames";
import { DateTime } from "luxon";

const LABELS: Record<View, string> = {
  month: "Månad",
  week: "Vecka",
  day: "Dag",
};

const MenuItem: FunctionComponent<{
  key: Key;
  children: ReactNode;
  onClick: () => void;
}> = ({ key, children, onClick }) => (
  <Menu.Item key={key}>
    {({ active }) => (
      <button
        onClick={onClick}
        className={classNames(
          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
          "block w-full px-4 py-2 text-left text-sm"
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

const Scroller: FunctionComponent = () => {
  const { view, setCursor } = useSchedule();

  function scroll(steps: number) {
    setCursor((prev) => prev.plus({ [view]: steps }));
  }

  return (
    <div className="inline-flex w-full items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
      <button
        className="p-1.5 text-gray-400 hover:bg-gray-100"
        onClick={() => scroll(-1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <hr className="h-6 border-l sm:hidden" />
      <button
        className="px-3 py-1.5 text-sm font-semibold  text-gray-900 hover:bg-gray-100 max-sm:hidden"
        onClick={() => setCursor(DateTime.now())}
      >
        Idag
      </button>
      <button
        className="p-1.5 text-gray-400 hover:bg-gray-100"
        onClick={() => scroll(1)}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

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
          </MenuItem>
        ))}
      </DropdownMenu>
    </Menu>
  );
}

function Options() {
  const { setView, setCursor } = useSchedule();

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
  const { cursor, view } = useSchedule();
  let subheading;
  switch (view) {
    case "week":
      subheading = `Vecka ${cursor.weekNumber}`;
      break;
    case "day":
      subheading = cursor.toLocaleString({ weekday: "long" });
      break;
  }

  return (
    <header className="mb-2 flex h-12 items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">
          {cursor.toLocaleString(HEADING_DATE_FORMAT[view])}
        </h1>
        {subheading && <h2 className="text-sm text-gray-500">{subheading}</h2>}
      </div>
      <div className="flex items-center gap-2">
        <Scroller />
        <ViewDropdown />
        <Options />
      </div>
    </header>
  );
}
