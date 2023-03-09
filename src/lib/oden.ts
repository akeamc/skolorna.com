import { error } from "@sveltejs/kit";
import type { DateTime } from "luxon";
import request from "./request";
import * as api from "@opentelemetry/api";
import { catchySpan } from "./util/tracing";

export const ODEN_URL = "https://api.skolorna.com/v03/oden";

const tracer = api.trace.getTracer("oden-client");

export interface Stats {
	menus: number;
	meals: number;
}

export function getStats(): Promise<Response> {
	return catchySpan(tracer, "getStats", async (span) => {
		const res = await request(`${ODEN_URL}/stats`, undefined, { auth: false });
		if (!res.ok) {
			throw error(res.status, "failed to get stats");
		}
		span.setStatus({
			code: api.SpanStatusCode.OK
		});
		return res;
	});
}

export interface Menu {
	title: string;
	id: string;
	checked_at: string;
	osm_id: string | null;
}

export function getMenu(id: string): Promise<Response> {
	return catchySpan(tracer, "getMenu", async (span) => {
		const res = await request(`${ODEN_URL}/menus/${id}`, undefined, { auth: false });
		if (!res.ok) {
			throw error(res.status, "failed to get menu");
		}
		span.setStatus({
			code: api.SpanStatusCode.OK
		});
		return res;
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

export function getDays(menu: string, first: DateTime, last: DateTime): Promise<Day[]> {
	return catchySpan(tracer, "getDays", async (span) => {
		const res = await request(
			`${ODEN_URL}/menus/${menu}/days?first=${first.toISODate()}&last=${last.toISODate()}`,
			undefined,
			{ auth: false }
		);

		if (!res.ok) throw error(res.status, await res.text());

		const data = await res.json();

		span.setStatus({
			code: api.SpanStatusCode.OK
		});

		return data;
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
	return catchySpan(
		tracer,
		"getReviews",
		{
			attributes: {
				menu: query.menu,
				date: query.date,
				meal: query.meal
			}
		},
		async (span) => {
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
	return catchySpan(
		tracer,
		"createReview",
		{
			attributes: {
				menu_id: data.menu_id
			}
		},
		async (span) => {
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
		}
	);
}

export function deleteReview(id: string): Promise<void> {
	return catchySpan(
		tracer,
		"deleteReview",
		{
			attributes: {
				id
			}
		},
		async (span) => {
			const res = await request(`${ODEN_URL}/reviews/${id}`, {
				method: "DELETE"
			});

			if (!res.ok) throw error(res.status, await res.text());

			span.setStatus({ code: api.SpanStatusCode.OK });
		}
	);
}
