import type { Menu } from "$lib/oden/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, setHeaders }) => {
	const res = await fetch(`https://api.skolorna.com/v0/oden/menus/${params.id}`);
	const data: Menu = await res.json();

	setHeaders({
		age: res.headers.get("age"),
		"cache-control": res.headers.get("cache-control")
	});

	return data;
};
