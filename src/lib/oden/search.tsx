import { MeiliSearch, SearchResponse } from "meilisearch";
import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import { ODEN_ENDPOINT } from "./client";
import { Menu } from "./menus";

export const HOST_URL = "https://api.skolorna.com/v0/search";
export const INDEX_NAME = "menus";

export const useSearchKey = () =>
  useSWR(`${ODEN_ENDPOINT}/key`, async (path) => {
    const res = await fetch(path);
    return res.text();
  });

export const useSearchClient = () => {
  const { data: key } = useSearchKey();
  return new MeiliSearch({
    host: HOST_URL,
    apiKey: key,
  });
};

export interface SearchContextData {
  refine: (query: string) => void;
  query: string;
  result?: SearchResponse<Menu>;
  limit: number;
}

export const SearchContext = createContext<SearchContextData>({
  refine: () => {},
  query: "",
  limit: 10,
});

export const SearchProvider: FunctionComponent<{ limit?: number }> = ({
  children,
  limit = 10,
}) => {
  const ms = useSearchClient();
  const index = ms.index(INDEX_NAME);
  const [query, refine] = useState("");

  const [result, setResult] = useState<SearchResponse<Menu>>();
  const { data } = useSWR([HOST_URL, INDEX_NAME, query, limit], () =>
    index.search<Menu>(query, { limit })
  );

  useEffect(() => {
    if (data) {
      setResult(data);
    }
  }, [data]);

  return (
    <SearchContext.Provider value={{ refine, query, result, limit }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
