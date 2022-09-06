import { getMenu, type Menu } from "$lib/oden";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, setHeaders }) => {
	const res = await getMenu(params.id);

	if (res.ok) {
		setHeaders({
			"cache-control": "public, max-age=3600"
		});
		return (await res.json()) as Menu;
	}

	throw error(res.status, await res.text());
};
