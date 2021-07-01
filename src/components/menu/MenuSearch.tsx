import React, { FunctionComponent, useEffect } from "react";
import { useDelayedInput } from "../../lib/forms/delayed-input";
import { useMenuSearch } from "../../lib/menu-proxy/menu";
import MenuTile from "./MenuTile";

const MenuSearch: FunctionComponent = () => {
  const limit = 20;

  const { setQuery, query, results } = useMenuSearch(limit);

  const { value, setInput } = useDelayedInput(250);

  useEffect(() => {
    setQuery(value);
  }, [setQuery, value]);

  return (
    <div>
      <input
        className="rounded-md border-gray-300 placeholder-gray-300 font-medium text-xl p-4"
        type="search"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        maxLength={32}
        onInput={(event) => setInput(event.currentTarget.value)}
        placeholder="Sök"
      />
      <div>
        {query.length > 0 && results?.length <= 0 ? (
          <span>
            inga menyer som matchar &quot;<strong>{query}</strong>&quot;
            hittades
          </span>
        ) : (
          <ol>
            {results?.map((menu) => (
              <li key={menu.id}>
                <MenuTile menu={menu} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default MenuSearch;
