import {
  Dispatch, SetStateAction, useEffect, useState,
} from "react";
import rankWord from "./rank-word";

export type Document = Record<string, unknown>;
export type DocumentIndex<T extends Document> = [string, T][];
export type RankedDocuments<T extends Document> = [number, T][];

/**
 * Minimal in-browser search engine. Tested with 7k documents.
 */
export default class MicroSearch<T extends Document> {
  public documents: DocumentIndex<T>;

  public static indexDocuments<T extends Document>(
    documents: T[],
    field: keyof T,
  ): DocumentIndex<T> {
    const index: DocumentIndex<T> = documents.map((document) => {
      const fieldValue = document[field];

      if (typeof fieldValue !== "string") {
        throw new Error("specified field must be of type string");
      }

      const key = fieldValue.toLocaleLowerCase();

      return [key, document];
    });

    return index;
  }

  constructor(documents: T[], field: keyof T) {
    this.documents = MicroSearch.indexDocuments(documents, field);
  }

  public search(rawQuery: string, limit?: number): T[] {
    const query = rawQuery.toLocaleLowerCase();

    const scores = this.documents.reduce((acc, [key, document]) => {
      const score = rankWord(key, query);

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
}

export interface UseMicroSearch<T extends Document> {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  results: T[];
}

export function useMicroSearch<T extends Document>(
  documents: T[],
  field: keyof T,
  limit?: number,
): UseMicroSearch<T> {
  const [microSearch, setMicroSearch] = useState<MicroSearch<T>>();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<T[]>([]);

  useEffect(() => {
    setMicroSearch(new MicroSearch<T>(documents, field));
  }, [documents]);

  useEffect(() => {
    setResults(microSearch?.search(query, limit) ?? []);
  }, [query]);

  return {
    query,
    setQuery,
    results,
  };
}
