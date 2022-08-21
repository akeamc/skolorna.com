export async function getKey(): Promise<string> {
	const res = await fetch("https://api.skolorna.com/v0/oden/key");
	return res.text();
}

export type Hit<T> = T;

export interface SearchResponse<T> {
	exhaustiveHits: boolean;
	hits: Hit<T>[];
	limit: number;
	nbHits: number;
	offset: number;
	processingTimeMs: number;
	query: string;
}

export interface SearchRequest {
	q: string;
}

export async function search<T>(req: SearchRequest, key: string): Promise<SearchResponse<T>> {
	const res = await fetch("https://api.skolorna.com/v0/search/indexes/menus/search", {
		method: "POST",
		headers: {
			authorization: `Bearer ${key}`,
			"content-type": "application/json"
		},
		body: JSON.stringify(req)
	});

	return res.json();
}
