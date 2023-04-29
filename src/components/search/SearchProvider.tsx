"use client";

import { PropsWithChildren, useState } from "react";
import { Query, SearchContext, SearchResponse } from "./search";
import { useQuery } from "@tanstack/react-query";
import { ODEN_URL } from "@/lib/oden";

export default function SearchProvider<T>({
  index,
  children,
}: PropsWithChildren<{ index: string }>) {
  const { data: key } = useQuery({
    queryKey: ["oden", "key"],
    queryFn: async () => {
      const res = await fetch(`${ODEN_URL}/key`);
      return res.text();
    },
  });
  const [query, setQuery] = useState<Query<T>>({ q: "" });
  const [response, setResponse] = useState<SearchResponse<T> | null>(null);

  useQuery({
    queryKey: ["search", index, query],
    queryFn: async () => {
      const res = await fetch(
        `https://api.skolorna.com/v03/search/indexes/${index}/search`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${key}`,
          },
          body: JSON.stringify(query),
        }
      );
      return res.json();
    },
    enabled: !!key,
    onSuccess: (data) => setResponse(data),
  });

  return (
    <SearchContext.Provider
      value={{
        query: query as Query<unknown>,
        setQuery,
        response,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
