<script lang="ts">
	import Button from "$lib/Button.svelte";
	import ButtonGroup from "$lib/ButtonGroup.svelte";
	import Modal from "$lib/Modal.svelte";
	import Spinner from "$lib/Spinner.svelte";
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import { Link2Icon } from "svelte-feather-icons";
	import { createLink, getLinks, type Link as LinkClass } from "../../client";
	import Link from "./Link.svelte";

	export let open: boolean;
	export let onClose: (() => void) | undefined = undefined;

	const LINKS_QUERY_KEY = ["schedule", "links"];

	const client = useQueryClient();

	$: linksQuery = createQuery({
		queryKey: LINKS_QUERY_KEY,
		queryFn: () => getLinks(),
		enabled: open
	});

	const addLinkMutation = createMutation({
		mutationFn: () => createLink(),
		onSuccess: (link) => {
			client.setQueryData<LinkClass[]>(LINKS_QUERY_KEY, (links) => {
				if (links) return [link, ...links];
			});
		}
	});

	function onDelete(id: string) {
		client.setQueryData<LinkClass[]>(LINKS_QUERY_KEY, (links) => {
			if (links) return links.filter((link) => link.id !== id);
		});
	}
</script>

<Modal {open} {onClose} closeButton={false} width="narrow">
	<div slot="main">
		<h2>Dela schema</h2>
		{#if $linksQuery.isSuccess}
			{#if $linksQuery.data.length > 0}
				<ul>
					{#each $linksQuery.data as link (link.id)}
						<Link {link} on:delete={() => onDelete(link.id)} />
					{/each}
				</ul>
			{/if}
		{:else}
			<div class="spinner">
				<Spinner />
			</div>
		{/if}
	</div>
	<div slot="footer">
		<ButtonGroup justify="space-between">
			<Button
				type="button"
				on:click={() => $addLinkMutation.mutate()}
				size="small"
				variant="tetriary"
			>
				<Link2Icon />
				Ny länk
			</Button>
			<Button type="button" on:click={onClose} size="small">Klar</Button>
		</ButtonGroup>
	</div>
</Modal>

<style lang="scss">
	h2 {
		margin-block: 0 1rem;
		font: 700 1.5rem var(--font-sans);
		letter-spacing: -0.017em;
	}

	.spinner {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 4rem;
	}

	ul {
		border: 1px solid var(--outline);
		border-radius: 0.5rem;
		background-color: var(--surface1);
		padding: 0;
		margin: 0;
	}
</style>
