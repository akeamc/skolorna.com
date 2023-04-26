"use client";

import { FunctionComponent, useEffect, useState } from "react";
import SearchProvider from "../search/SearchProvider";
import { Hit, IndexedMenu, useSearch } from "../search/search";
import { Menu, Stats, useMenu, useNextDay } from "@/lib/oden";
import { Search } from "react-feather";
import Link from "next/link";
import sanitize from "sanitize-html";
import { DateTime } from "luxon";
import Spinner from "../Spinner";
import useHistory from "@/lib/useHistory";

type MenuProp = Hit<IndexedMenu> | Menu;

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
          DateTime.DATE_MED_WITH_WEEKDAY
        );
      } else {
        footer = "Ingen data";
      }
  }

  return (
    <Link
      href={menu ? `/menyer/${menu.id}` : "#"}
      className="group mb-[1px] rounded-lg px-2 text-gray-500 outline-none ring-inset ring-blue-600 hover:bg-blue-100 focus-visible:ring-2 active:bg-blue-200"
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
  const { data: menuData } = useMenu(
    typeof menu === "string" ? menu : undefined
  );
  if (typeof menu === "string") {
    menu = menuData;
  }

  return (
    <li>
      <Link
        href={menu ? `/menyer/${menu.id}` : "#"}
        className="block rounded-lg p-1 px-2 pb-0 text-sm font-medium text-gray-900 outline-none ring-inset ring-blue-600 hover:bg-blue-100 focus-visible:ring-2 active:bg-blue-200"
      >
        <h3>
          <Title menu={menu} />
        </h3>
        <span className="text-xs text-gray-500">
          {menu && "last_day" in menu && menu.last_day
            ? `-> ${DateTime.fromISO(menu.last_day).toLocaleString(
                DateTime.DATE_SHORT
              )}`
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
    </li>
  );
};

const Results: FunctionComponent = () => {
  const { query, response } = useSearch<IndexedMenu>();
  const { ids } = useHistory();

  const hits = query.q === "" ? ids.slice(0, 20) : response?.hits || [];

  return (
    <div className="absolute z-10 mt-1 h-96 w-full overflow-y-auto overflow-x-hidden rounded-lg border bg-white shadow-xl">
      {query.q === "" && (
        <div className="px-2 py-1 text-xs font-medium text-gray-500">
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
        {hits.map((hit) => (
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
  );
};

const Box: FunctionComponent<{ stats?: Stats }> = ({ stats }) => {
  const { query, setQuery, response } = useSearch<IndexedMenu>();
  const [input, setInput] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery({ q: input, attributesToHighlight: ["title"] });
    }, 100);

    return () => clearTimeout(timeout);
  }, [input, setQuery]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        className="w-full rounded-lg border border-gray-100 bg-white p-4  pl-8 text-base font-medium"
        placeholder={`Sök bland ${stats?.menus || "tusentals"} menyer`}
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
    </div>
  );
};

const BigSearch: FunctionComponent<{ stats?: Stats }> = ({ stats }) => (
  <SearchProvider index="menus">
    <div className="relative">
      <Box stats={stats} />
      <Results />
    </div>
  </SearchProvider>
);

export default BigSearch;
