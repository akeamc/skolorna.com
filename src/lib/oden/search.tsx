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
import { string } from "yup";
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
}

export const SearchContext = createContext<SearchContextData>({
  refine: () => {},
  query: "",
});

export const SearchProvider: FunctionComponent = ({ children }) => {
  const ms = useSearchClient();
  const index = ms.index(INDEX_NAME);
  const [query, refine] = useState("");

  const [result, setResult] = useState<SearchResponse<Menu>>();
  const { data } = useSWR(`${HOST_URL}/${INDEX_NAME}?q=${query}`, async () => {
    const res = await index.search(query);
    return res;
  });

  useEffect(() => {
    if (data) {
      setResult(data as SearchResponse<Menu>);
    }
  }, [data]);

  return (
    <SearchContext.Provider value={{ refine, query, result }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
