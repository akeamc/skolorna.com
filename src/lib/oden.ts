import { error } from "@sveltejs/kit";
import type { DateTime } from "luxon";
import request from "./request";
import * as api from "@opentelemetry/api";

export const ODEN_URL = "https://api.skolorna.com/v03/oden";

const tracer = api.trace.getTracer("oden-client");

export interface Stats {
	menus: number;
	meals: number;
}

export function getStats(): Promise<Response> {
	return tracer.startActiveSpan("getStats", async (span) => {
		try {
			const res = await request(`${ODEN_URL}/stats`, undefined, { auth: false });
			if (!res.ok) {
				throw error(res.status, "failed to get stats");
			}
			span.setStatus({
				code: api.SpanStatusCode.OK
			});
			return res;
		} catch (err) {
			span.setStatus({
				code: api.SpanStatusCode.ERROR
			});
			throw err;
		} finally {
			span.end();
		}
	});
}

export interface Menu {
	title: string;
	id: string;
	checked_at: string;
	osm_id: string | null;
}

export function getMenu(id: string): Promise<Response> {
	return tracer.startActiveSpan("getMenu", async (span) => {
		try {
			const res = await request(`${ODEN_URL}/menus/${id}`, undefined, { auth: false });
			if (!res.ok) {
				throw error(res.status, "failed to get menu");
			}
			span.setStatus({
				code: api.SpanStatusCode.OK
			});
			return res;
		} catch (err) {
			span.setStatus({
				code: api.SpanStatusCode.ERROR
			});
			throw err;
		}
	});
}

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

export async function getDays(menu: string, first: DateTime, last: DateTime): Promise<Day[]> {
	return tracer.startActiveSpan("getDays", async (span) => {
		try {
			const res = await request(
				`${ODEN_URL}/menus/${menu}/days?first=${first.toISODate()}&last=${last.toISODate()}`,
				undefined,
				{ auth: false }
			);

			if (res.ok) {
				const data = await res.json();
				return data;
			}

			throw error(res.status, await res.text());
		} catch (err) {
			span.setStatus({
				code: api.SpanStatusCode.ERROR
			});
			throw err;
		} finally {
			span.end();
		}
	});
}

interface GetReviews {
	menu?: string;
	date?: string;
	meal?: string;
}

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

export function getReviews(query: GetReviews): Promise<Review[]> {
	return tracer.startActiveSpan(
		"getReviews",
		{
			attributes: {
				menu: query.menu,
				date: query.date,
				meal: query.meal
			}
		},
		async (span) => {
			try {
				const res = await request(
					`${ODEN_URL}/reviews?${new URLSearchParams(query as Record<string, string>)}`,
					undefined,
					{ auth: false }
				);

				const data = await res.json();

				if (!res.ok) throw error(res.status, data);

				span.setStatus({
					code: api.SpanStatusCode.OK
				});
				return data;
			} catch (err) {
				span.setStatus({
					code: api.SpanStatusCode.ERROR
				});
				throw err;
			} finally {
				span.end();
			}
		}
	);
}

type RatingHistogram = Record<number, number>;

export function ratingHistogram(reviews: Review[]): RatingHistogram {
	const histogram: RatingHistogram = {};

	for (const review of reviews) {
		histogram[review.rating] = (histogram[review.rating] || 0) + 1;
	}

	return histogram;
}

interface CreateReview {
	menu_id: string;
	date: string;
	meal: string;
	rating: number;
	comment?: string;
}

export function createReview(data: CreateReview): Promise<Review> {
	return tracer.startActiveSpan(
		"createReview",
		{
			attributes: {
				menu_id: data.menu_id
			}
		},
		async (span) => {
			try {
				const res = await request(`${ODEN_URL}/reviews`, {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify(data)
				});

				const created = await res.json();
				span.setStatus({ code: api.SpanStatusCode.OK });
				return created;
			} catch (err) {
				span.setStatus({ code: api.SpanStatusCode.ERROR });
				throw err;
			} finally {
				span.end();
			}
		}
	);
}

export function deleteReview(id: string) {
	tracer.startActiveSpan(
		"deleteReview",
		{
			attributes: {
				id
			}
		},
		async (span) => {
			try {
				const res = await request(`${ODEN_URL}/reviews/${id}`, {
					method: "DELETE"
				});

				if (!res.ok) {
					throw error(res.status, await res.text());
				}

				span.setStatus({ code: api.SpanStatusCode.OK });
			} catch (err) {
				span.setStatus({ code: api.SpanStatusCode.ERROR });
				throw err;
			} finally {
				span.end();
			}
		}
	);
}
