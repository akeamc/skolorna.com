"use client";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { Meal, Review, Stats } from ".";
import { API_URL } from "../api/config";

export const useStats = () =>
  useQuery({
    queryKey: ["oden", "stats"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/stats`);
      if (!res.ok) throw new Error("failed to get stats");
      const stats: Stats = await res.json();
      return stats;
    },
  });

export function onReviewChange(
  client: QueryClient,
  menu: string,
  meal: Meal,
  updateFn: (old: Review[]) => Review[]
) {
  client.invalidateQueries({ queryKey: ["oden", "menus", menu, "days"] });
  client.setQueryData<Review[]>(["oden", "reviews", meal.value], (old) => {
    if (!old) return undefined;

    return updateFn(old);
  });
}
