<script lang="ts">
	import type { Menu } from "$lib/oden";
	import { createKeyQuery, search, type IndexedMenu } from "$lib/search/client";
	import { createQuery } from "@tanstack/svelte-query";

	export let menu: Menu;

	const key = createKeyQuery();

	$: nearby = createQuery({
		queryKey: ["nearby", menu.id],
		enabled: !!$key.isSuccess && !!menu.location,
		queryFn: async () => {
			if (!menu.location) throw new Error("menu has no location");
			const { x, y } = menu.location;
			const menus = await search<IndexedMenu>(
				{
					q: "",
					sort: [`_geoPoint(${y},${x}):asc`]
				},
				$key.data!
			);
			return menus.hits.filter((m) => m.id != menu.id);
		}
	});
</script>

{#if $nearby.isSuccess}
	<ul>
		{#each $nearby.data as menu}
			<li>
				<a href={`/menyer/${menu.id}`}>{menu.title} ({menu._geoDistance} m)</a>
			</li>
		{/each}
	</ul>
{/if}
