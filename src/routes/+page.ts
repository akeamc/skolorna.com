import { getStats, type Stats } from "$lib/oden";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ setHeaders }) => {
	try {
		const res = await getStats();
		setHeaders({
			"cache-control": "public, max-age=3600, stale-while-revalidate=86400, stale-if-error=604800"
		});
		const stats: Stats = await res.json();
		return stats;
	} catch (e) {
		console.error(e);
		return null;
	}
};
