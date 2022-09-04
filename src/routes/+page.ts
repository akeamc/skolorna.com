import type { PageLoad } from "./$types";

interface Stats {
	menus: number;
	days: number;
}

export const load: PageLoad = async ({ setHeaders }) => {
	try {
		const res = await fetch("https://api-staging.skolorna.com/v0/oden/stats");
		const stats: Stats = await res.json();
		setHeaders({
			age: res.headers.get("age"),
			"cache-control": res.headers.get("cache-control")
		});
		return stats;
	} catch (e) {
		console.error(e);
	}
};
