import React, { FunctionComponent, useEffect } from "react";
import { useDelayedInput } from "../../lib/forms/delayed-input";
import { useMenuSearch } from "../../lib/menu-proxy/menu";
import MenuTile from "./MenuTile";
import styles from "./MenuSearch.module.scss";

const MenuSearch: FunctionComponent = () => {
  const limit = 20;

  const { setQuery, query, results } = useMenuSearch(limit);

  const { value, setInput } = useDelayedInput(250);

  useEffect(() => {
    setQuery(value);
  }, [setQuery, value]);

  const noResults = query.length > 0 && results?.length <= 0;

  return (
    <div>
      <input
        type="search"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        maxLength={32}
        onInput={(event) => setInput(event.currentTarget.value)}
        placeholder="Sök"
      />
      <div className={styles.results}>
        {noResults ? (
          <span>
            Inga menyer som matchar &quot;<strong>{query}</strong>&quot;
            hittades
          </span>
        ) : (
          <div className={styles.grid}>
            {results?.map((menu) => (
              <MenuTile menu={menu} key={menu.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSearch;
