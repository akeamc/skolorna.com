import React, { FunctionComponent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AnimatePresence,
  AnimateSharedLayout,
  motion,
  Variants,
} from "framer-motion";
import classNames from "classnames/bind";
import Container from "./Container";
import styles from "./Navbar.module.scss";
import { InstantMenuSearch } from "../../lib/oden/instantsearch";
import {
  connectHits,
  connectInfiniteHits,
  connectSearchBox,
  connectStats,
  SearchBoxProvided,
} from "react-instantsearch-core";
import { Search as SearchIcon } from "react-feather";
import { DateTime } from "luxon";
import { SearchProvider, useSearch } from "../../lib/oden/search";
import { Menu } from "../../lib/oden/menus";

const cx = classNames.bind(styles);

const SearchBox: FunctionComponent = () => {
  const { query, refine } = useSearch();

  return (
    <div className={cx("searchBox")}>
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

const Hit: FunctionComponent<{ hit: Menu }> = ({ hit }) => {
  // const updatedAt = DateTime.fromISO(hit.updated_at);

  return (
    <Link href={`/menyer/${hit.id}`}>
      <a className={styles.hit} title={hit.title}>
        {hit.title}
      </a>
    </Link>
  );
};

const Result: FunctionComponent = () => {
  const { result } = useSearch();
  const { locale } = useRouter();

  if (!result) return null;

  const totalHits = result.estimatedTotalHits ?? (result as any).nbHits; // backwards compatibility
  const processingTime = Math.max(result.processingTimeMs, 1) / 1000; // seconds

  return (
    <div className={styles.searchResults}>
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
        <div className={styles.noResults}>
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

export const Navbar: FunctionComponent = () => {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <Container>
        <div className={styles.horizontal}>
          <Search />
        </div>
      </Container>
    </nav>
  );
};
