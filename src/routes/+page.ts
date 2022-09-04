import { getStats, type Stats } from "$lib/oden";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ setHeaders }) => {
	try {
		const res = await getStats();
		setHeaders({
			age: res.headers.get("age"),
			"cache-control": res.headers.get("cache-control")
		});
		const stats: Stats = await res.json();
		return stats;
	} catch (e) {
		console.error(e);
	}
};
