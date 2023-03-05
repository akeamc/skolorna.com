<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { MapPinIcon } from "svelte-feather-icons";
	import Skeleton from "./Skeleton.svelte";
	import { getElement, osmUrl } from "./util/osm";

	export let id: string;

	$: elementQuery = createQuery({
		queryKey: ["osm", id],
		queryFn: () => getElement(id),
		enabled: !!id
	});

	$: name = $elementQuery?.data?.tags?.name;
</script>

<a href={osmUrl(id)}>
	<MapPinIcon />

	{#if name}
		{name}
	{:else}
		<Skeleton width="20ch" />
	{/if}
</a>

<style lang="scss">
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text0-muted);
		text-decoration: none;
	}

	a:hover {
		color: var(--text0);
	}

	a :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
