<script lang="ts">
	import Button from "$lib/Button.svelte";
	import ButtonGroup from "$lib/ButtonGroup.svelte";
	import Modal from "$lib/Modal.svelte";
	import { CopyIcon, Link2Icon, Trash2Icon } from "svelte-feather-icons";
	import { createLink, getLinks, type Link as LinkClass } from "../../client";
	import Link from "./Link.svelte";

	export let open: boolean;
	export let onClose: (() => void) | undefined = undefined;

	let links: LinkClass[] = [];

	$: if (open) {
		getLinks().then((res) => (links = res));
	}

	function addLink() {
		createLink().then((link) => {
			links = [...links, link];
		});
	}
</script>

<Modal {open} {onClose} closeButton={false} width="narrow">
	<div slot="main">
		<h2>Dela schema</h2>
		{#if links.length > 0}
			<ul>
				{#each links as link (link.id)}
					<Link {link} {links} setLinks={(l) => (links = l)} />
				{/each}
			</ul>
		{/if}
	</div>
	<div slot="footer">
		<ButtonGroup justify="space-between">
			<Button type="button" on:click={addLink} size="medium" variant="secondary">
				<Link2Icon />
				Ny länk
			</Button>
			<Button type="button" on:click={onClose} size="medium">Klar</Button>
		</ButtonGroup>
	</div>
</Modal>

<style lang="scss">
	h2 {
		margin-block: 0 1rem;
		font: 700 1.5rem var(--font-sans);
		letter-spacing: -0.017em;
	}

	ul {
		border: 1px solid var(--outline);
		border-radius: 0.5rem;
		background-color: var(--surface1);
		padding: 0;
		margin: 0;
	}
</style>
