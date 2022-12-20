<script lang="ts">
	import Button from "$lib/Button.svelte";
	import ButtonGroup from "$lib/ButtonGroup.svelte";
	import Modal from "$lib/Modal.svelte";
	import { CopyIcon, Link2Icon, Trash2Icon } from "svelte-feather-icons";
	import { createLink, getLinks } from "../client";

	export let open: boolean;
	export let onClose: (() => void) | undefined = undefined;

	let links = getLinks();

	$: if (open) links = getLinks();
</script>

<Modal {open} {onClose} closeButton={false} width="narrow">
	<div slot="main">
		<h2>Dela schema</h2>
		{#await links then links}
			<ul>
				{#each links as link (link.id)}
					<li class="link">
						<!-- <a href={link.url} target="_blank" rel="noopener noreferrer">{link.id}</a> -->
						<span class="id">{link.id.substring(0, 8)}</span>
						<Button
							type="button"
							on:click={() => link.copyToClipboard()}
							size="small"
							variant="tetriary"><CopyIcon /></Button
						>
						<Button
							type="button"
							color="danger"
							on:click={() => link.delete()}
							size="small"
							variant="tetriary"><Trash2Icon /></Button
						>
					</li>
				{:else}
					<li class="link">Inga delningslänkar</li>
				{/each}
			</ul>
		{/await}
	</div>
	<div slot="footer">
		<ButtonGroup justify="space-between">
			<Button type="button" on:click={createLink} size="medium" variant="secondary"
				><Link2Icon />Ny länk</Button
			>
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
		padding: 0;
		margin: 0;
	}

	.link {
		list-style: none;
		padding-block: 0.5rem;
		border-top: 1px solid var(--outline);
		font-size: 0.75rem;
		color: var(--text0-muted);
		display: flex;
		align-items: center;

		&:last-child {
			border-bottom: 1px solid var(--outline);
		}

		.id {
			font-family: var(--font-mono);
			padding-inline: 0.4em;
			padding-block: 0.2em;
			border-radius: 0.25rem;
			background-color: var(--surface1);
			color: var(--text0);
			font-weight: 500;
			margin-inline-end: auto;
		}
	}
</style>
