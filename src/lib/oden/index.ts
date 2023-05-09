// import type { DateTime } from "luxon";
// import request from "./request";
// import * as api from "@opentelemetry/api";
// import { catchySpan } from "./util/tracing";

import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import request from "../request";

export const ODEN_URL = "https://api.skolorna.com/v03/oden";

// const tracer = api.trace.getTracer("oden-client");

export interface Stats {
  menus: number;
  meals: number;
}

// export function getStats(): Promise<Response> {
// 	return catchySpan(tracer, "getStats", async (span) => {
// 		const res = await request(`${ODEN_URL}/stats`, undefined, { auth: false });
// 		if (!res.ok) {
// 			throw error(res.status, "failed to get stats");
// 		}
// 		span.setStatus({
// 			code: api.SpanStatusCode.OK
// 		});
// 		return res;
// 	});
// }

export interface Menu {
  title: string;
  id: string;
  checked_at: string;
  osm_id: string | null;
  location: { x: number; y: number } | null;
}

export async function getMenu(id: string): Promise<Response> {
  return fetch(`${ODEN_URL}/menus/${id}`);
  // return catchySpan(tracer, "getMenu", async (span) => {
  // const res = await request(`${ODEN_URL}/menus/${id}`, undefined, { auth: false });
  // if (!res.ok) {
  // throw error(res.status, "failed to get menu");
  // }
  // span.setStatus({
  // 	code: api.SpanStatusCode.OK
  // });
  // return res;
  // });
}

export const useMenu = (id?: string) =>
  useQuery({
    queryKey: ["oden", "menus", id],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const res = await fetch(`${ODEN_URL}/menus/${id}`);
      if (!res.ok) throw new Error("failed to get menu");
      const menu: Menu = await res.json();
      return menu;
    },
    enabled: !!id,
  });

export interface Meal {
  value: string;
  rating: number | null;
  reviews: number;
}

export interface Day {
  /**
   * ISO8601 date
   */
  date: string;
  meals: Meal[];
}

export const useDays = ({
  menu,
  first,
  last,
}: {
  menu?: string;
  first?: string;
  last?: string;
}) =>
  useQuery<Day[]>({
    queryKey: ["oden", "menus", menu, "days", first, last],
    queryFn: async () => {
      const res = await fetch(
        `${ODEN_URL}/menus/${menu}/days?first=${first}&last=${last}`
      );
      const days: Day[] = await res.json();
      return days;
    },
    enabled: !!menu && !!first && !!last,
  });

export const useNextDay = (menu?: string) => {
  const today = DateTime.local().toISODate() || undefined;
  const nextWeek = DateTime.local().plus({ weeks: 1 }).toISODate() || undefined;
  const res = useDays({ menu, first: today, last: nextWeek });

  return {
    ...res,
    data: res.data?.[0],
  };
};

// export function getDays(menu: string, first: DateTime, last: DateTime): Promise<Day[]> {
// 	return catchySpan(tracer, "getDays", async (span) => {
// 		const res = await request(
// 			`${ODEN_URL}/menus/${menu}/days?first=${first.toISODate()}&last=${last.toISODate()}`,
// 			undefined,
// 			{ auth: false }
// 		);

// 		if (!res.ok) throw error(res.status, await res.text());

// 		const data = await res.json();

// 		span.setStatus({
// 			code: api.SpanStatusCode.OK
// 		});

// 		return data;
// 	});
// }

export interface Review {
  id: string;
  author: string;
  menu_id: string;
  date: string;
  meal: string;
  rating: number;
  comment: string | null;
  created_at: string;
  edited_at: string | null;
}

// export function getReviews(query: GetReviews): Promise<Review[]> {
// 	return catchySpan(
// 		tracer,
// 		"getReviews",
// 		{
// 			attributes: {
// 				menu: query.menu,
// 				date: query.date,
// 				meal: query.meal
// 			}
// 		},
// 		async (span) => {
// 			const res = await request(
// 				`${ODEN_URL}/reviews?${new URLSearchParams(query as Record<string, string>)}`,
// 				undefined,
// 				{ auth: false }
// 			);

// 			const data = await res.json();

// 			if (!res.ok) throw error(res.status, data);

// 			span.setStatus({
// 				code: api.SpanStatusCode.OK
// 			});

// 			return data;
// 		}
// 	);
// }

// type RatingHistogram = Record<number, number>;

// export function ratingHistogram(reviews: Review[]): RatingHistogram {
// 	const histogram: RatingHistogram = {};

// 	for (const review of reviews) {
// 		histogram[review.rating] = (histogram[review.rating] || 0) + 1;
// 	}

// 	return histogram;
// }

export interface CreateReview {
  menu_id: string;
  date: string;
  meal: string;
  rating: number;
  comment?: string;
}

export async function createReview(data: CreateReview): Promise<Review> {
  // gtag?.("event", "create_review", {
  // 	...data
  // });

  const res = await request(`${ODEN_URL}/reviews`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const created = await res.json();
  // span.setStatus({ code: api.SpanStatusCode.OK });
  return created;
}

export async function deleteReview(id: string): Promise<void> {
  // gtag?.("event", "delete_review", {
  // 	id
  // });

  const res = await request(`${ODEN_URL}/reviews/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(await res.text());
}
