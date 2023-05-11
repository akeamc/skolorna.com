"use client";

import { FunctionComponent, useEffect, useState } from "react";
import SearchProvider from "../search/SearchProvider";
import { Hit, IndexedMenu, useSearch } from "../search/search";
import { Menu, useMenu, useNextDay } from "@/lib/oden";
import { Clock, Search as SearchIcon } from "react-feather";
import Link from "next/link";
import sanitize from "sanitize-html";
import { DateTime } from "luxon";
import Spinner from "../Spinner";
import classNames from "classnames";
import { Transition } from "@headlessui/react";
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
    <Link
      href={url}
      className="group mb-px rounded-lg px-2 text-gray-500 outline-none ring-inset ring-blue-600 hover:bg-blue-100 focus-visible:ring-2 active:bg-blue-200"
      tabIndex={-1}
    >
      <div className="mb-[-1px] flex h-48 flex-col overflow-hidden border-b py-2">
        <h3 className="font-medium text-gray-900">
          <Title menu={menu} />
        </h3>
        {isLoading && <Spinner className="m-auto" />}
        <ul className="relative mb-2 line-clamp-6 h-full after:absolute after:bottom-0 after:block after:h-12 after:w-full after:bg-gradient-to-b after:from-transparent after:to-white after:content-[''] group-hover:after:to-blue-100 group-active:after:to-blue-200">
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
      <Link
        href={url}
        className="block rounded-lg p-1 px-2 pb-0 text-sm font-medium text-gray-900 outline-none ring-inset ring-blue-600 hover:bg-blue-100 focus-visible:ring-2 active:bg-blue-200"
        tabIndex={-1}
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
      <div
        className="absolute z-10 mt-1 h-96 w-full overflow-y-auto overflow-x-hidden rounded-lg border bg-white shadow-xl"
        // @ts-expect-error
        tabindex={-1}
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
      </div>
    </Transition>
  );
};

const Box: FunctionComponent<{ setFocused: (focused: boolean) => void }> = ({
  setFocused,
}) => {
  const { data: stats } = useStats();
  const { setQuery } = useSearch<IndexedMenu>();
  const [input, setInput] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery({
        q: input,
        attributesToHighlight: ["title"],
        sort: ["last_day:desc"],
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [input, setQuery]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        className="h-10 w-full rounded-lg border border-gray-100 bg-white pl-8 text-base font-medium outline-none ring-inset ring-blue-600 focus:ring-1 sm:text-sm"
        placeholder={`Sök bland ${stats?.menus || "tusentals"} menyer`}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

const BigSearch: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <SearchProvider index="menus">
      <div className={classNames("relative z-10", className)}>
        <Box setFocused={setFocused} />
        <Results focused={focused} />
      </div>
    </SearchProvider>
  );
};

export default BigSearch;
