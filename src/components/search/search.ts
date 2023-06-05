import { createContext, useContext } from "react";

export type Hit<T> = T & {
  _formatted?: T;
  _geoDistance?: number;
};

export interface SearchResponse<T> {
  exhaustiveHits: boolean;
  hits: Hit<T>[];
  limit: number;
  estimatedTotalHits: number;
  offset: number;
  processingTimeMs: number;
  query: string;
}

export interface IndexedMenu {
  id: string;
  title: string;
  slug: string;
  checked_at: string;
  last_day: string | null;
}

type Sort<T> = `${keyof T & string}:${"asc" | "desc"}`;

export interface Query<T> {
  q: string;
  sort?: Sort<T>[];
  attributesToHighlight?: (keyof T)[];
}

export interface SearchContextData<T> {
  query: Query<T>;
  setQuery: (query: Query<T>) => void;
  response: SearchResponse<T> | null;
}

export const SearchContext = createContext<SearchContextData<unknown>>({
  query: { q: "" },
  setQuery: () => {},
  response: null,
});

export const useSearch = <T>() =>
  useContext(SearchContext) as SearchContextData<T>;
