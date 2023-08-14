"use client";

import { PropsWithChildren, useState } from "react";
import { Query, SearchContext } from "./search";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api/config";

export default function SearchProvider<T>({
  index,
  children,
}: PropsWithChildren<{ index: string }>) {
  const { data: key } = useQuery({
    queryKey: ["oden", "key"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/key`);
      return res.text();
    },
  });
  const [query, setQuery] = useState<Query<T>>({ q: "" });

  const { data } = useQuery({
    queryKey: ["search", index, query],
    queryFn: async () => {
      const res = await fetch(
        `https://api.skolorna.com/search/indexes/${index}/search`,
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
    placeholderData: keepPreviousData,
  });

  return (
    <SearchContext.Provider
      value={{
        query: query as Query<unknown>,
        setQuery,
        response: data,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
