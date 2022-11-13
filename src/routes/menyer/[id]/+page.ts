import { getMenu, type Menu } from "$lib/oden";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, setHeaders }) => {
	const res = await getMenu(params.id);
	setHeaders({
		age: res.headers.get("age"),
		"cache-control": res.headers.get("cache-control")
	});

	if (res.ok) return (await res.json()) as Menu;

	throw error(res.status, await res.text());
};
