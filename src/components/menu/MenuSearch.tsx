import Link from "next/link";
import React, { FormEventHandler, FunctionComponent, useCallback } from "react";
import { useMenuSearch } from "../../lib/menu-proxy/menu";

const MenuSearch: FunctionComponent = () => {
  const { setQuery, results } = useMenuSearch(20);

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
        <ol className="list-decimal list-inside">
          {results?.map((menu) => (
            <li key={menu.id}>
              <Link href={`/menus/${menu.id}`} prefetch={false}>
                <a>{menu.title}</a>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default MenuSearch;
