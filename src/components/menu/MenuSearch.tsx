import React, { FunctionComponent, useCallback, useEffect } from "react";
import { Search } from "react-feather";
import { useDelayedInput } from "../../lib/forms/delayed-input";
import { useMenuSearch } from "../../lib/menu-proxy/menu";
import MenuTile from "./MenuTile";
import styles from "./MenuSearch.module.scss";
import InlineSkeleton from "../skeleton/InlineSkeleton";
import { Menu } from "../../lib/menu-proxy/types";
import Grid from "../layout/Grid";
import { useRouter } from "next/router";

interface SearchResultsProps {
  results: Menu[];
  searching: boolean;
  initializing: boolean;
  query: string;
  size: number;
}

const SearchResults: FunctionComponent<SearchResultsProps> = ({
  results,
  searching,
  query,
  initializing,
  size,
}) => {
  const noResults = !searching && results.length === 0;
  const skeleton = initializing || (searching && results.length === 0);

  if (noResults) {
    return (
      <span>
        Inga menyer som matchar &quot;<strong>{query}</strong>&quot; hittades.
      </span>
    );
  }

  return (
    <>
      <div className={styles.count}>
        {initializing ? (
          <InlineSkeleton width="6em" />
        ) : (
          <>
            {skeleton ? <InlineSkeleton width="1em" /> : results.length} av{" "}
            {size}
          </>
        )}
      </div>
      <Grid>
        {(skeleton ? new Array(12).fill(undefined) : results).map((menu, i) => (
          <MenuTile menu={menu} key={menu?.id ?? i} />
        ))}
      </Grid>
    </>
  );
};

interface SearchBoxProps {
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const SearchBox: FunctionComponent<SearchBoxProps> = ({
  onChange,
  disabled,
  placeholder,
}) => {
  const router = useRouter();

  const q = router.query.q?.toString() ?? "";

  useEffect(() => {
    onChange(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className={styles.search}>
      <Search className={styles.icon} />
      <input
        type="search"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        onInput={(event) => {
          router.push({ query: { q: event.currentTarget.value } }, undefined, {
            shallow: true,
          });
        }}
        className={styles.input}
        disabled={disabled}
        placeholder={placeholder}
        value={q}
      />
    </div>
  );
};

const MenuSearch: FunctionComponent = () => {
  const limit = 60;

  const { setQuery, query, results, size, searching } = useMenuSearch(limit);

  const { value, setInput } = useDelayedInput(200);

  useEffect(() => {
    setQuery(value);
  }, [setQuery, value]);

  const initializing = size === 0;

  return (
    <div>
      <SearchBox
        onChange={setInput}
        placeholder={initializing ? "Läser in ..." : "Sök"}
        disabled={initializing}
      />

      <section className={styles.results}>
        <SearchResults {...{ searching, initializing, results, query, size }} />
      </section>
    </div>
  );
};

export default MenuSearch;
