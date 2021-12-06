import classNames from "classnames/bind";
import Link from "next/link";
import React, { FunctionComponent, useState } from "react";
import { Search as SearchIcon } from "react-feather";
import {
  connectInfiniteHits,
  connectSearchBox,
  SearchBoxProvided,
} from "react-instantsearch-core";
import { Highlight } from "react-instantsearch-dom";
import { InstantMenuSearch } from "../../lib/oden/instantsearch";
import { useDays } from "../../lib/oden/menus";
import styles from "./Search.module.scss";

const cx = classNames.bind(styles);

const Box: FunctionComponent<SearchBoxProvided> = ({
  refine,
  currentRefinement,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cx("searchBox", { focused })}>
      <SearchIcon />
      <input
        type="search"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Sök bland tusentals menyer ..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

export const SearchBox = connectSearchBox(Box);

export interface HitProps<T = any> {
  hit: T;
}

export const Hit: FunctionComponent<HitProps> = ({ hit }) => {
  const { data } = useDays(hit.id);
  const nextDay = data?.[0];

  return (
    <Link href={`/menyer/${hit.id}`}>
      <a className={styles.hit}>
        <div className={styles.hitContent}>
          <h3>
            <Highlight hit={hit} attribute="title" />
          </h3>
          <div className={styles.hitMeta}>
            {nextDay ? (
              <span>{nextDay.meals.map((meal) => meal.value).join("; ")}</span>
            ) : (
              <span>Ingen information</span>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

const Hits = connectInfiniteHits(({ hits }) => (
  <div className={styles.hits}>
    <ol>
      {hits.map((hit) => (
        <li key={hit.id}>
          <Hit hit={hit} />
        </li>
      ))}
    </ol>
  </div>
));

/**
 * Menu search.
 */
export const Search: FunctionComponent = () => (
  <InstantMenuSearch>
    <SearchBox />
    <Hits />
  </InstantMenuSearch>
);
