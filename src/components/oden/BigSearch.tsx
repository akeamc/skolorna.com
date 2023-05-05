"use client";

import {
  Fragment,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import SearchProvider from "../search/SearchProvider";
import { Hit, IndexedMenu, useSearch } from "../search/search";
import { Menu, useMenu, useNextDay } from "@/lib/oden";
import { Clock, Search as SearchIcon } from "react-feather";
import Link from "next/link";
import sanitize from "sanitize-html";
import { DateTime } from "luxon";
import Spinner from "../Spinner";
import classNames from "classnames";
import { Combobox, Transition } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { useStats } from "@/lib/oden/hooks";
import { useHistory } from "@/lib/oden/history";

type MenuProp = Hit<IndexedMenu> | Menu;

function menuUrl(menu?: MenuProp | string): string {
  const id = typeof menu === "string" ? menu : menu?.id;

  if (id) {
    return `/menyer/${id}`;
  } else {
    return "#";
  }
}

const Title: FunctionComponent<{ menu?: MenuProp }> = ({ menu }) => {
  if (menu && "_formatted" in menu && menu._formatted?.title) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: sanitize(menu._formatted.title) }}
      />
    );
  }

  return <>{menu?.title}</>;
};

const HighlightedMenu: FunctionComponent<{ menu?: MenuProp | string }> = ({
  menu,
}) => {
  const url = menuUrl(menu);
  const { data: menuData } = useMenu(
    typeof menu === "string" ? menu : undefined
  );
  if (typeof menu === "string") {
    menu = menuData;
  }
  const { data: day, isLoading, status } = useNextDay(menu?.id);
  let footer;

  switch (status) {
    case "error":
      footer = "Ett fel uppstod";
      break;
    case "success":
      if (day) {
        footer = DateTime.fromISO(day.date).toLocaleString(
          DateTime.DATE_MED_WITH_WEEKDAY,
          { locale: "sv" }
        );
      } else {
        footer = "Ingen data";
      }
  }

  return (
    <Combobox.Option value={menu} as={Fragment}>
      <Link
        href={url}
        className="group mb-px rounded-lg px-2 text-gray-500 outline-none ring-inset ring-blue-600 hover:bg-blue-100 focus-visible:ring-2 active:bg-blue-200 ui-active:bg-blue-100"
      >
        <div className="mb-[-1px] flex h-48 flex-col overflow-hidden border-b py-2">
          <h3 className="font-medium text-gray-900">
            <Title menu={menu} />
          </h3>
          {isLoading && <Spinner className="m-auto" />}
          <ul className="relative mb-2 line-clamp-6 h-full after:absolute after:bottom-0 after:block after:h-12 after:w-full after:bg-gradient-to-b after:from-transparent after:to-white after:content-[''] group-hover:after:to-blue-100 group-active:after:to-blue-200 ui-active:after:to-blue-100">
            {day?.meals.map((meal) => (
              <li key={meal.value} className="my-1 text-sm">
                {meal.value}
              </li>
            ))}
          </ul>
          <span className="mt-auto text-xs font-medium">{footer}</span>
        </div>
        <style jsx>{`
          h3 :global(em) {
            font-style: normal;
            text-decoration: underline;
          }
        `}</style>
      </Link>
    </Combobox.Option>
  );
};

const ListItem: FunctionComponent<{ menu?: MenuProp | string }> = ({
  menu,
}) => {
  const url = menuUrl(menu);
  const { data: menuData } = useMenu(
    typeof menu === "string" ? menu : undefined
  );
  if (typeof menu === "string") {
    menu = menuData;
  }

  const lastDay =
    menu && "last_day" in menu && menu.last_day
      ? DateTime.fromISO(menu.last_day)
      : undefined;

  return (
    <>
      <Combobox.Option value={menu} as={Fragment}>
        <Link
          href={url}
          className="block rounded-lg p-1 px-2 pb-0 text-sm font-medium text-gray-900 outline-none ring-inset ring-blue-600 hover:bg-blue-100 focus-visible:ring-2 active:bg-blue-200 ui-active:bg-blue-100"
        >
          <h3>
            <Title menu={menu} />
          </h3>
          <span
            className={classNames(
              "text-xs",
              lastDay && +lastDay < +DateTime.now()
                ? "text-gray-400"
                : "text-gray-500"
            )}
          >
            {lastDay
              ? `-> ${lastDay.toLocaleString(DateTime.DATE_SHORT, {
                  locale: "sv",
                })}`
              : "Ingen information"}
          </span>
          <hr className="mt-1" />
        </Link>
      </Combobox.Option>
      <style jsx>{`
        h3 :global(em) {
          font-style: normal;
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

const Results: FunctionComponent<{ focused: boolean }> = ({ focused }) => {
  const { query, response } = useSearch<IndexedMenu>();
  const ids = useHistory();

  const hits = query.q === "" ? ids.slice(0, 20) : response?.hits || [];

  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      show={focused}
    >
      <Combobox.Options
        static
        as="div"
        className="absolute z-10 mt-1 h-96 w-full overflow-y-auto overflow-x-hidden rounded-lg border bg-white shadow-xl"
      >
        {query.q === "" && (
          <div className="px-2 py-1 text-xs font-medium text-gray-500">
            <Clock className="mr-1 inline h-3 w-3" />
            Senast visade
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {hits.slice(0, 3).map((hit) => (
            <HighlightedMenu
              key={typeof hit === "string" ? hit : hit.id}
              menu={hit}
            />
          ))}
        </div>
        <ol>
          {hits.slice(3).map((hit) => (
            <ListItem key={typeof hit === "string" ? hit : hit.id} menu={hit} />
          ))}
        </ol>
        {query.q !== "" && (
          <span className="p-2 text-xs font-medium text-gray-500">
            {response?.estimatedTotalHits} resultat (
            {((response?.processingTimeMs || 0) / 1000).toLocaleString("sv", {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })}{" "}
            sekunder)
          </span>
        )}
      </Combobox.Options>
    </Transition>
  );
};

const Box: FunctionComponent<{
  setFocused: (focused: boolean) => void;
}> = ({ setFocused }) => {
  const { data: stats } = useStats();
  const { setQuery } = useSearch<IndexedMenu>();
  const [input, setInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const path = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery({ q: input, attributesToHighlight: ["title"] });
    }, 100);

    return () => clearTimeout(timeout);
  }, [input, setQuery]);

  // hide results on navigation
  useEffect(() => {
    ref.current?.blur();
  }, [path]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Combobox.Input
        type="search"
        className="w-full rounded-lg border border-gray-100 bg-white p-3 pl-8 text-base font-medium outline-none ring-inset ring-blue-600 focus:ring-2"
        placeholder={`Sök bland ${stats?.menus || "tusentals"} menyer`}
        onChange={(e) => setInput(e.target.value)}
        displayValue={({ title }) => title}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        ref={ref}
      />
    </div>
  );
};

const BigSearch: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  return (
    <SearchProvider index="menus">
      <Combobox
        as="div"
        className={classNames("relative z-10", className)}
        onChange={({ id }) => router.push(`/menyer/${id}`)}
      >
        <Box setFocused={setFocused} />
        <Results focused={focused} />
      </Combobox>
    </SearchProvider>
  );
};

export default BigSearch;
