import { Search as SearchIcon } from "react-feather";
import { SearchProvider, useSearch } from "../../lib/oden/search";
import { Menu, useMenu } from "../../lib/oden/menus";
import { FunctionComponent, useState } from "react";
import Link from "next/link";
import styles from "./Search.module.scss";
import { useRouter } from "next/router";
import { useMenuHistory } from "../../lib/menu/history";
import { Skeleton } from "../skeleton/Skeleton";

const SearchBox: FunctionComponent = () => {
  const { query, refine } = useSearch();

  return (
    <div className={styles.searchBox}>
      <SearchIcon />
      <input
        type="search"
        value={query}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Sök bland tusentals menyer"
      />
    </div>
  );
};

const Hit: FunctionComponent<{ hit?: Menu }> = ({ hit }) => {
  const inner = (
    <a className={styles.hit} title={hit?.title}>
      {hit?.title ?? <Skeleton />}
    </a>
  );

  if (hit) {
    return <Link href={`/menyer/${hit.id}`}>{inner}</Link>;
  } else {
    return inner;
  }
};

const RecentMenu: FunctionComponent<{ id: string }> = ({ id }) => {
  const { data } = useMenu(id);

  return <Hit hit={data} />;
};

const Landing: FunctionComponent = () => {
  const { stack } = useMenuHistory();
  const { limit } = useSearch();

  if (stack.length === 0) {
    return null;
  }

  return (
    <ul>
      {stack.slice(0, limit).map(({ key }) => (
        <li key={key}>
          <RecentMenu id={key} />
        </li>
      ))}
    </ul>
  );
};

const Result: FunctionComponent = () => {
  const { query, result } = useSearch();
  const { locale } = useRouter();

  if (query === "") {
    return (
      <div className={styles.results}>
        <Landing />
      </div>
    );
  }

  if (!result) return null;

  const totalHits = result.estimatedTotalHits ?? (result as any).nbHits; // backwards compatibility
  const processingTime = Math.max(result.processingTimeMs, 1) / 1000; // seconds

  return (
    <div className={styles.results}>
      <ol
        className={styles.hits}
        onClick={() => (document.activeElement as HTMLElement | null)?.blur()}
      >
        {result.hits.map((hit) => (
          <li key={hit.id}>
            <Hit hit={hit} />
          </li>
        ))}
      </ol>
      {result?.hits.length === 0 ? (
        <div className={styles.info}>
          <div className={styles.art}>(╯°□°)╯︵ ┻━┻ </div>
          <p>Inga menyer hittades.</p>
        </div>
      ) : (
        <div className={styles.meta}>
          {totalHits} resultat ({processingTime.toLocaleString(locale)}{" "}
          sekunder)
        </div>
      )}
    </div>
  );
};

const Search: FunctionComponent = () => {
  return (
    <div className={styles.search}>
      <SearchProvider>
        <SearchBox />
        <Result />
      </SearchProvider>
    </div>
  );
};

export default Search;
