"use client";

import { useQuery } from "@tanstack/react-query";
import { ODEN_URL, Stats } from ".";

export const useStats = () =>
  useQuery({
    queryKey: ["oden", "stats"],
    queryFn: async () => {
      const res = await fetch(`${ODEN_URL}/stats`);
      if (!res.ok) throw new Error("failed to get stats");
      const stats: Stats = await res.json();
      return stats;
    },
  });
