import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu } from "../../types";
import levenshtein from "damerau-levenshtein";
import rankWord from "../../lib/search/rank-word";

export interface PageProps {
  menus: Menu[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const res = await fetch("http://localhost:8000/menus");
  const menus: Menu[] = await res.json();

  return {
    props: {
      menus,
    },
  };
};

const MenusPage: NextPage<PageProps> = ({ menus }) => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<Menu[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const limit = 20;

  useEffect(() => {
    const lowercaseQuery = query.toLocaleLowerCase();

    const ranked = menus.reduce((acc, menu) => {
      const ranking = rankWord(menu.title.toLocaleLowerCase(), lowercaseQuery);

      if (typeof ranking === "number") {
        acc.push([menu, ranking]);
      }

      return acc;
    }, [] as [Menu, number][]);

    const sorted = ranked.sort((a, b) => a[1] - b[1]).map(([menu]) => menu);

    setResult(sorted.slice(0, limit));
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onInput={() => setQuery(inputRef?.current?.value ?? "")}
        placeholder="Sök ..."
        ref={inputRef}
      />
      <ul>
        {result.map((menu) => (
          <li key={menu.id}>
            <Link href={`/menus/${menu.id}`} prefetch={false}>
              <a>{menu.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenusPage;
