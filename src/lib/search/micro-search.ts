import { useCallback, useEffect, useState } from "react";
import rankWord from "./rank-word";

export type Document = Record<string, unknown>;
export type DocumentIndex<T extends Document> = [string, T][];
export type RankedDocuments<T extends Document> = [number, T][];

/**
 * Minimal in-browser search engine. Tested with 7k documents.
 */
export default class MicroSearch<T extends Document> {
  public documents: DocumentIndex<T>;

  public static tokenize(word: string): string {
    return word.toLowerCase();
  }

  public static indexDocuments<T extends Document>(
    documents: T[],
    field: keyof T
  ): DocumentIndex<T> {
    const index: DocumentIndex<T> = documents.map((document) => {
      const fieldValue = document[field];

      if (typeof fieldValue !== "string") {
        throw new Error("specified field must be of type string");
      }

      const token = this.tokenize(fieldValue);

      return [token, document];
    });

    return index;
  }

  constructor(documents: T[], field: keyof T) {
    this.documents = MicroSearch.indexDocuments(documents, field);
  }

  public search(query: string, limit?: number): T[] {
    const queryToken = MicroSearch.tokenize(query);

    const scores = this.documents.reduce((acc, [key, document]) => {
      const score = rankWord(key, queryToken);

      if (typeof score === "number") {
        acc.push([score, document]);
      }

      return acc;
    }, [] as RankedDocuments<T>);

    const sorted = scores
      .sort(([aScore], [bScore]) => aScore - bScore)
      .slice(0, limit);

    return sorted.map((entry) => entry[1]);
  }

  public get size(): number {
    return this.documents.length;
  }
}

export type SetQuery = (query: string) => void;

export interface UseMicroSearch<T extends Document> {
  query: string;
  setQuery: SetQuery;
  results: T[];
  size: number;
  searching: boolean;
}

export function useMicroSearch<T extends Document>(
  documents: T[],
  field: keyof T,
  limit?: number
): UseMicroSearch<T> {
  const [microSearch, setMicroSearch] = useState<MicroSearch<T>>();
  const [internalQuery, setInternalQuery] = useState<string>("");
  const [searching, setSearching] = useState(true);
  const [results, setResults] = useState<T[]>([]);

  useEffect(() => {
    setMicroSearch(new MicroSearch<T>(documents, field));
  }, [documents, field]);

  const executeSearch = useCallback(
    (query: string) => {
      if (microSearch && microSearch.size > 0) {
        setResults(microSearch.search(query, limit));
        setSearching(false);
      }
    },
    [limit, microSearch]
  );

  useEffect(() => {
    executeSearch(internalQuery);
  }, [executeSearch, internalQuery]);

  const setQuery: SetQuery = useCallback((query) => {
    setSearching(true);
    setInternalQuery(query);
  }, []);

  return {
    query: internalQuery,
    setQuery,
    results,
    size: microSearch?.size ?? 0,
    searching,
  };
}
