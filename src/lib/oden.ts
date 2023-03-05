import { error } from "@sveltejs/kit";
import type { DateTime } from "luxon";
import request from "./request";

export const ODEN_URL = "https://api.skolorna.com/v03/oden";

export interface Stats {
	menus: number;
	meals: number;
}

export function getStats(): Promise<Response> {
	return request(`${ODEN_URL}/stats`, undefined, { auth: false });
}

export interface Menu {
	title: string;
	id: string;
	checked_at: string;
	osm_id: string | null;
}

export function getMenu(id: string): Promise<Response> {
	return request(`${ODEN_URL}/menus/${id}`, undefined, { auth: false });
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
	const res = await request(
		`${ODEN_URL}/menus/${menu}/days?first=${first.toISODate()}&last=${last.toISODate()}`,
		undefined,
		{ auth: false }
	);

	if (res.ok) {
		return await res.json();
	}

	throw error(res.status, await res.text());
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

export async function getReviews(query: GetReviews): Promise<Review[]> {
	const res = await request(
		`${ODEN_URL}/reviews?${new URLSearchParams(query as Record<string, string>)}`,
		undefined,
		{ auth: false }
	);

	return res.json();
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

export async function createReview(data: CreateReview): Promise<Review> {
	const res = await request(`${ODEN_URL}/reviews`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(data)
	});

	return res.json();
}

export async function deleteReview(id: string) {
	return request(`${ODEN_URL}/reviews/${id}`, {
		method: "DELETE"
	});
}
