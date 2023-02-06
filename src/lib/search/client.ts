import { get as getOden } from "$lib/oden";
import request from "$lib/request";

export async function getKey(): Promise<string> {
	const res = await getOden("/key");
	return res.text();
}

export type Hit<T> = T & {
	_formatted?: T;
};

export interface IndexedMenu {
	id: string;
	title: string;
	slug: string;
	checked_at: string;
	last_day: string;
}

export interface SearchResponse<T> {
	exhaustiveHits: boolean;
	hits: Hit<T>[];
	limit: number;
	estimatedTotalHits: number;
	offset: number;
	processingTimeMs: number;
	query: string;
}

type SortableAttribute = "updated_at" | "last_day";

type Direction = "asc" | "desc";

type Sort = `${SortableAttribute}:${Direction}`;

export interface SearchRequest<T> {
	q: string;
	sort?: Sort[];
	attributesToHighlight?: (keyof T)[];
}

export async function search<T>(req: SearchRequest<T>, key: string): Promise<SearchResponse<T>> {
	const res = await request(
		"https://api.skolorna.com/v03/search/indexes/menus/search",
		{
			method: "POST",
			headers: {
				authorization: `Bearer ${key}`,
				"content-type": "application/json"
			},
			body: JSON.stringify(req)
		},
		{ auth: false }
	);

	return res.json();
}
