"use client";

import {
  Fragment,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import SearchProvider from "../search/SearchProvider";
import { Hit as HitType, IndexedMenu, useSearch } from "../search/search";
import sanitizeHtml from "sanitize-html";
import Link from "next/link";
import { Combobox, Transition } from "@headlessui/react";
import { Check, ChevronsDown } from "react-feather";
import classNames from "classnames";

const Hit: FunctionComponent<{ hit: HitType<IndexedMenu> }> = ({ hit }) => {
  return (
    <li>
      <Link href={`/menyer/${hit.id}`}>
        <h3
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(hit._formatted?.title || ""),
          }}
          className=""
        />
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

const Box: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const { query, setQuery, response } = useSearch<IndexedMenu>();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery({ q: input, attributesToHighlight: ["title"] });
    }, 100);

    return () => clearTimeout(timeout);
  });

  return (
    <Combobox>
      <Combobox>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setInput(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {response?.hits?.map((hit) => (
                <Combobox.Option
                  key={hit.id}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-10 pr-4",
                      active ? "bg-blue-600 text-white" : "text-gray-500"
                    )
                  }
                  value={hit}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {hit.title}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </Combobox>
    // <div>
    //   <input
    //     type="search"
    //     value={input}
    //     onChange={(e) => setInput(e.target.value)}
    //     onFocus={() => setOpen(true)}
    //     className="w-full z-20 px-4 py-2 text-sm font-medium text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //   />
    // </div>
  );
};

const MenuSearch: FunctionComponent = () => {
  return (
    <SearchProvider index="menus">
      <Box />
    </SearchProvider>
  );
};

export default MenuSearch;
