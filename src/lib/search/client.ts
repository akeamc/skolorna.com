import { ODEN_URL } from "$lib/oden";
import request from "$lib/request";
import { catchySpan } from "$lib/util/tracing";
import * as api from "@opentelemetry/api";
import { SpanStatusCode } from "@opentelemetry/api";
import { error } from "@sveltejs/kit";
import { createQuery } from "@tanstack/svelte-query";

const tracer = api.trace.getTracer("search-client");

export function getKey(): Promise<string> {
	return catchySpan(tracer, "getKey", async (span) => {
		const res = await request(`${ODEN_URL}/key`, undefined, { auth: false });
		if (!res.ok) {
			throw error(res.status, "failed to get key");
		}
		const text = await res.text();
		span.setStatus({
			code: SpanStatusCode.OK
		});
		return text;
	});
}

export type Hit<T> = T & {
	_formatted?: T;
	_geoDistance?: number;
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

type Sort = `${SortableAttribute}:${Direction}` | `_geoPoint(${number},${number}):${Direction}`;

export interface SearchRequest<T> {
	q: string;
	sort?: Sort[];
	attributesToHighlight?: (keyof T)[];
}

export function search<T>(req: SearchRequest<T>, key: string): Promise<SearchResponse<T>> {
	return catchySpan(
		tracer,
		"search",
		{
			attributes: {
				query: req.q
			}
		},
		async (span) => {
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

			const data = await res.json();
			span.setStatus({ code: SpanStatusCode.OK });
			return data;
		}
	);
}

export const createKeyQuery = () =>
	createQuery({
		queryKey: ["search", "apiKey"],
		queryFn: getKey
	});
