<script lang="ts">
	import Modal from "$lib/Modal.svelte";
	import { createQuery } from "@tanstack/svelte-query";
	import { createLink, getLinks } from "../client";
	import Spinner from "$lib/Spinner.svelte";
	import ButtonGroup from "$lib/ButtonGroup.svelte";
	import Button from "$lib/Button.svelte";

	export let open: boolean;
	export let onClose: () => void;

	let copied = false;

	const LINKS_QUERY_KEY = ["schedule", "links"];

	async function getLink() {
		const links = await getLinks();

		if (links.length > 0) return links[0];

		return createLink();
	}

	let timeout: NodeJS.Timeout;

	async function copy() {
		if (!$linkQuery.isSuccess) return;
		clearTimeout(timeout);
		await navigator.clipboard.writeText($linkQuery.data.icalUrl);
		copied = true;
		timeout = setTimeout(() => (copied = false), 5000);
	}

	$: linkQuery = createQuery({
		queryKey: LINKS_QUERY_KEY,
		queryFn: getLink,
		enabled: open
	});
</script>

<Modal {open} {onClose}>
	<div slot="main">
		{#if $linkQuery.isSuccess}
			<h2>Exportera schema</h2>
			<p>För att synkronisera schemat med din Google-kalender kan du importera den:</p>
			<ol>
				<li>
					Öppna <a href="https://calendar.google.com/calendar/r/settings/addbyurl"
						>Google Kalender</a
					>
					och klicka på <strong>Inställningar</strong>.
				</li>
				<li>
					I menyn till vänster, klicka på <strong>Lägg till kalender</strong> och sedan
					<strong>Från webbadress</strong>.
				</li>
				<li>
					Kopiera länken och klistra in den i fältet <strong>Kalenderns webbadress</strong>.
				</li>
				<li>
					Klicka på <strong>Lägg till kalender</strong>.
				</li>
			</ol>
			<p>
				För att kalendern ska synas i mobilen måste du även aktivera synkronisering i
				inställningarna på din telefon.
			</p>
		{:else}
			<div class="spinner">
				<Spinner />
			</div>
		{/if}
	</div>
	<div slot="footer">
		{#if $linkQuery.isSuccess}
			<ButtonGroup justify="space-between">
				<Button type="button" on:click={copy} size="medium">
					{#if copied}
						Kopierad
					{:else}
						Kopiera länk
					{/if}
				</Button>
			</ButtonGroup>
		{/if}
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
		min-height: 6rem;
	}

	ol,
	p {
		color: var(--text0);
		font: 400 1rem var(--font-sans);
	}
</style>
