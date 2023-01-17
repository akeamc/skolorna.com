<script lang="ts">
	import { MapPinIcon } from "svelte-feather-icons";
	import Skeleton from "./Skeleton.svelte";
	import { getElement, osmUrl, type OsmElement } from "./util/osm";

	export let id: string;

	let element: OsmElement;

	$: getElement(id).then((el) => (element = el));

	$: name = element?.tags?.name;
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
