<script lang="ts">
	import Button from "$lib/Button.svelte";
	import { createMutation } from "@tanstack/svelte-query";
	import { createEventDispatcher } from "svelte";
	import { CopyIcon, Trash2Icon } from "svelte-feather-icons";
	import type { Link as LinkClass } from "../../client";

	export let link: LinkClass;

	const dispatch = createEventDispatcher();

	$: deleteMutation = createMutation({
		mutationFn: () => link.del(),
		onSuccess: () => {
			dispatch("delete");
		}
	});

	async function copy() {
		await link.copyToClipboard();
	}
</script>

<li>
	<!-- <a href={link.url} target="_blank" rel="noopener noreferrer">{link.id}</a> -->
	<span class="id">{link.id.substring(0, 8)}</span>
	<Button type="button" on:click={copy} size="small" variant="tetriary">
		<CopyIcon />
	</Button>
	<Button
		type="button"
		color="danger"
		on:click={() => $deleteMutation.mutate()}
		size="small"
		variant="tetriary"
	>
		<Trash2Icon />
	</Button>
</li>

<style lang="scss">
	li {
		list-style: none;
		padding: 0.5rem;
		font-size: 0.75rem;
		color: var(--text0-muted);
		display: flex;
		align-items: center;

		&:not(:last-child) {
			border-bottom: 1px solid var(--outline);
		}

		.id {
			font-family: var(--font-mono);
			padding-inline: 0.4em;
			padding-block: 0.2em;
			border-radius: 0.25rem;
			background-color: var(--surface2);
			color: var(--text0);
			font-weight: 500;
			margin-inline-end: auto;
		}
	}
</style>
