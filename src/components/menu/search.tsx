import Link from "next/link";
import React, { FormEventHandler, FunctionComponent, useCallback } from "react";
import { useMenuSearch } from "../../lib/menu-proxy/menu";
import MenuTile from "./tile";

const MenuSearch: FunctionComponent = () => {
  const limit = 20;

  const { setQuery, results } = useMenuSearch(limit);

  const handleSearchInput: FormEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setQuery(event.currentTarget.value);
    },
    []
  );

  return (
    <div>
      <input
        className="rounded-md border-gray-300 placeholder-gray-300 font-medium text-xl p-4"
        type="search"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        maxLength={32}
        onInput={handleSearchInput}
        placeholder="Sök"
      />
      <div>
        {results.length}
        {results.length >= limit && "+"} träffar
        <ol>
          {results?.map((menu) => (
            <li key={menu.id}>
              <MenuTile menu={menu} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default MenuSearch;
