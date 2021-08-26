import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { Search } from "react-feather";
import Fuse from "fuse.js";
import classNames from "classnames/bind";
import { useDelayedInput } from "../../lib/forms/delayed-input";
import MenuTile from "./MenuTile";
import styles from "./MenuSearch.module.scss";
import InlineSkeleton from "../skeleton/InlineSkeleton";
import { Menu } from "../../lib/menu/types";
import Grid from "../layout/Grid";
import { useMenuFuse } from "../../lib/menu/menu";
import InfoText from "../typography/InfoText";

const cx = classNames.bind(styles);

interface MenuSearchContextData {
  results?: Fuse.FuseResult<Menu>[];
  query?: string;
  initializing: boolean;
  setQuery: (value: string) => void;
  searching: boolean;
  error?: Error;
}

const MenuSearchContext = createContext<MenuSearchContextData>({
  setQuery: () => {},
  initializing: true,
  searching: false,
});

const useMenuSearchContext = () => useContext(MenuSearchContext);

interface SearchResultsProps {
  limit?: number;
}

const SearchResults: FunctionComponent<SearchResultsProps> = ({
  limit = 30,
}) => {
  const {
    initializing,
    results: allResults = [],
    query = "",
    searching,
    error,
  } = useMenuSearchContext();

  const noResults = !(initializing || searching) && allResults.length === 0;
  const skeleton = initializing || allResults.length === 0;
  const results = allResults.slice(0, limit);

  if (!initializing && query.length === 0) {
    return <InfoText>Sök bland tusentals matsedlar.</InfoText>;
  }

  if (noResults) {
    return (
      <InfoText>
        Inga menyer som matchar &quot;<strong>{query}</strong>&quot; hittades.
      </InfoText>
    );
  }

  if (error) {
    return <InfoText>Det gick inte att hämta menyerna.</InfoText>;
  }

  return (
    <>
      <div className={styles.count}>
        {initializing ? (
          <InlineSkeleton width="6em" />
        ) : (
          <>
            Visar{" "}
            {skeleton ? (
              <InlineSkeleton width="4em" />
            ) : (
              `${results.length} av ${allResults.length}`
            )}{" "}
            resultat
          </>
        )}
      </div>
      <Grid>
        {(skeleton ? new Array(12).fill(undefined) : results).map(
          (result, i) => (
            <MenuTile menu={result?.item} key={result?.id ?? i} />
          )
        )}
      </Grid>
    </>
  );
};

const SearchBox: FunctionComponent = () => {
  const { setQuery, initializing, error } = useMenuSearchContext();
  const { output, setInput } = useDelayedInput(500);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setQuery(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output]);

  let placeholder = "Sök";

  if (initializing) placeholder = "Läser in ...";
  if (error) placeholder = "Ett fel inträffade";

  return (
    <div className={cx("search", { focused, initializing })}>
      <Search className={styles.icon} />
      <input
        type="search"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        onInput={(event) => setInput(event.currentTarget.value)}
        className={styles.input}
        disabled={initializing}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

const MenuSearch: FunctionComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Fuse.FuseResult<Menu>[]>();
  const [searching, setSearching] = useState(false);
  const { fuse, error } = useMenuFuse();

  useEffect(() => {
    async function executeSearch() {
      const searchResults = await fuse?.search(query);
      setResults(searchResults);
      setSearching(false);
    }

    executeSearch();
  }, [fuse, query]);

  return (
    <MenuSearchContext.Provider
      value={{
        results,
        query,
        setQuery: (value: string) => {
          setSearching(true);
          setQuery(value);
        },
        initializing: !fuse || !results,
        searching,
        error,
      }}
    >
      <SearchBox />

      <section className={styles.results}>
        <SearchResults />
      </section>
    </MenuSearchContext.Provider>
  );
};

export default MenuSearch;
