import { error } from "@sveltejs/kit";
import type { DateTime } from "luxon";
import request from "./request";

const API_URL = "https://api.skolorna.com/v03/oden";

export async function get(path: string): Promise<Response> {
	return request(`${API_URL}${path}`);
}

export interface Stats {
	menus: number;
	days: number;
}

export function getStats(): Promise<Response> {
	return get("/stats");
}

export interface Menu {
	title: string;
	id: string;
	checked_at: string;
	osm_id: string | null;
}

export function getMenu(id: string): Promise<Response> {
	return get(`/menus/${id}`);
}

export type Meal = string;

export interface Day {
	/**
	 * ISO8601 date
	 */
	date: string;
	meals: Meal[];
}

export async function getDays(menu: string, first: DateTime, last: DateTime): Promise<Day[]> {
	const res = await get(`/menus/${menu}/days?first=${first.toISODate()}&last=${last.toISODate()}`);

	if (res.ok) {
		return await res.json();
	}

	throw error(res.status, await res.text());
}
