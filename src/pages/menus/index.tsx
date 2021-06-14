import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMenuSearch } from "../../lib/menu-proxy/menus";
import { Menu } from "../../lib/menu-proxy/types";

const MenusPage: NextPage = () => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<Menu[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const menuSearch = useMenuSearch();

  useEffect(() => {
    setResult(menuSearch.search(query, 20));
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
