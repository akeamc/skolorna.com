import { MeiliSearch, SearchResponse } from "meilisearch";
import { useRouter } from "next/router";
import { useCallback } from "react";
import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import { useMenuHistory } from "../menu/history";
import { HistoryItem } from "../utils/history";
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

  if (typeof key === "undefined") return undefined;

  return new MeiliSearch({
    host: HOST_URL,
    apiKey: key,
  });
};

export interface SearchContextData {
  refine: (query: string) => void;
  query: string;
  response?: SearchResponse<Menu>;
  limit: number;
  focusedHit: number;
  focusHit: (i: number) => void;
  recent: HistoryItem[];
}

export const SearchContext = createContext<SearchContextData>({
  refine: () => {},
  query: "",
  limit: 10,
  focusedHit: 0,
  focusHit: () => {},
  recent: [],
});

export const SearchProvider: FunctionComponent<{ limit?: number }> = ({
  children,
  limit = 10,
}) => {
  const ms = useSearchClient();
  const [query, refine] = useState("");
  const [focusedHit, focusHit] = useState(0);
  const { stack } = useMenuHistory();

  const [response, setResponse] = useState<SearchResponse<Menu>>();
  const { data } = useSWR([HOST_URL, INDEX_NAME, query, limit], () =>
    ms?.index(INDEX_NAME).search<Menu>(query, { limit })
  );

  useEffect(() => {
    if (data) {
      setResponse(data);
    }
  }, [data]);

  return (
    <SearchContext.Provider
      value={{
        refine,
        query,
        response: response,
        limit,
        focusedHit,
        focusHit,
        recent: stack.slice(0, limit),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
