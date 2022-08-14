import { Search as SearchIcon } from "react-feather";
import { SearchProvider, useSearch } from "../../lib/oden/search";
import { Menu, useMenu } from "../../lib/oden/menus";
import {
  ChangeEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import styles from "./Search.module.scss";
import { useRouter } from "next/router";
import classNames from "classnames/bind";
import { InlineSkeleton } from "../skeleton/InlineSkeleton";
import { useCallback } from "react";

const cx = classNames.bind(styles);

const SearchBox: FunctionComponent = () => {
  const { query, refine, response, focusedHit, focusHit, recent } = useSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const onKeyDown: KeyboardEventHandler = useCallback(
    (e) => {
      switch (e.key) {
        case "Escape":
          inputRef.current?.blur();
          break;
        case "Enter":
          const hit = response?.hits[focusedHit];
          if (hit) {
            router.push(`/menyer/${hit.id}`);
          }
          break;
        case "ArrowUp":
          e.preventDefault(); // don't move the cursor
          focusHit(Math.max(focusedHit - 1, 0));
          break;
        case "ArrowDown":
          e.preventDefault(); // don't move the cursor
          const numOptions =
            query === "" ? recent.length : response?.hits.length || 0; // show recent
          focusHit(Math.min(numOptions - 1, focusedHit + 1));
          break;
      }
    },
    [focusHit, focusedHit, query, recent.length, response?.hits, router]
  );

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      refine(e.currentTarget.value);
      focusHit(0);
    },
    [focusHit, refine]
  );

  useEffect(() => {
    function blur() {
      (document.activeElement as HTMLElement)?.blur();
    }

    router.events.on("routeChangeComplete", blur);
    return () => router.events.off("routeChangeComplete", blur);
  }, [router]);

  return (
    <div className={styles.searchBox}>
      <SearchIcon />
      <input
        type="search"
        value={query}
        onChange={onChange}
        placeholder="Sök bland tusentals menyer"
        onFocus={() => focusHit(0)}
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </div>
  );
};

const Hit: FunctionComponent<{ hit?: Menu; focused?: boolean }> = ({
  hit,
  focused = false,
}) => {
  const inner = (
    <a className={cx("hit", { focused })} title={hit?.title} tabIndex={-1}>
      {hit?.title ?? <InlineSkeleton />}
    </a>
  );

  if (hit) {
    return (
      <Link href={`/menyer/${hit.id}`} passHref>
        {inner}
      </Link>
    );
  } else {
    return inner;
  }
};

const RecentMenu: FunctionComponent<{ id: string; focused?: boolean }> = ({
  id,
  focused,
}) => {
  const { data } = useMenu(id);

  return <Hit hit={data} focused={focused} />;
};

const Landing: FunctionComponent = () => {
  const { focusedHit, recent } = useSearch();

  if (recent.length === 0) {
    return null;
  }

  return (
    <ul>
      {recent.map(({ key }, i) => (
        <li key={key}>
          <RecentMenu id={key} focused={i === focusedHit} />
        </li>
      ))}
    </ul>
  );
};

const Result: FunctionComponent = () => {
  const { query, response, focusedHit } = useSearch();
  const { locale } = useRouter();

  if (query === "") {
    return (
      <div className={styles.results}>
        <Landing />
      </div>
    );
  }

  if (!response) return null;

  const totalHits = response.estimatedTotalHits ?? (response as any).nbHits; // backwards compatibility
  const processingTime = Math.max(response.processingTimeMs, 1) / 1000; // seconds

  return (
    <div className={styles.results}>
      <ol className={styles.hits}>
        {response.hits.map((hit, i) => (
          <li key={hit.id}>
            <Hit hit={hit} focused={i === focusedHit} />
          </li>
        ))}
      </ol>
      {response?.hits.length === 0 ? (
        <div className={styles.info}>
          <div className={styles.art}>(╯°□°）╯︵ ┻━┻ </div>
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
    <SearchProvider>
      <div className={styles.search}>
        <SearchBox />
        <Result />
      </div>
    </SearchProvider>
  );
};

export default Search;
