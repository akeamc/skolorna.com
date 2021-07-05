import React, { FunctionComponent, useEffect } from "react";
import { Search } from "react-feather";
import { useDelayedInput } from "../../lib/forms/delayed-input";
import { useMenuSearch } from "../../lib/menu-proxy/menu";
import MenuTile from "./MenuTile";
import styles from "./MenuSearch.module.scss";
import InlineSkeleton from "../skeleton/InlineSkeleton";

const MenuSearch: FunctionComponent = () => {
  const limit = 40;

  const { setQuery, query, results, size, searching } = useMenuSearch(limit);

  const { value, setInput } = useDelayedInput(250);

  useEffect(() => {
    setQuery(value);
  }, [setQuery, value]);

  const initializing = size === 0;
  const noResults = !searching && results.length <= 0;

  return (
    <div>
      <div className={styles.search}>
        <Search className={styles.icon} />
        <input
          type="search"
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          onInput={(event) => setInput(event.currentTarget.value)}
          placeholder="Sök"
          className={styles.input}
          disabled={initializing}
        />
      </div>
      <section className={styles.results}>
        {noResults ? (
          <span>
            Inga menyer som matchar &quot;<strong>{query}</strong>&quot;
            hittades.
          </span>
        ) : (
          <>
            <div className={styles.count}>
              {initializing ? (
                <InlineSkeleton width="6em" />
              ) : (
                <>
                  {searching ? <InlineSkeleton width="1em" /> : results.length}{" "}
                  av {size}
                </>
              )}
            </div>
            <div className={styles.grid}>
              {(initializing || searching
                ? new Array(12).fill(null)
                : results
              ).map((menu, index) => (
                <MenuTile menu={menu} key={menu?.id ?? index} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default MenuSearch;
