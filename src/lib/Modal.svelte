<script lang="ts">
	export let open: boolean;
	export let overlay = true;
	export let lockScroll = true;

	/**
	 * Modal close handler. If no function is provided, the modal won't be closable (no close button will be shown).
	 */
	export let onClose: (() => void) | undefined = undefined;

	import { XIcon } from "svelte-feather-icons";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";

	onMount(() => {
		if (open && lockScroll) {
			document.body.style.overflow = "hidden";
		}

		return () => (document.body.style.overflow = "auto");
	});

	$: if (browser) {
		if (open && lockScroll) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "auto";
	}
</script>

<div class="container" class:open class:overlay on:click={onClose}>
	<div class="modal" on:click|stopPropagation>
		{#if onClose}
			<button on:click={onClose} class="close-button">
				<XIcon />
			</button>
		{/if}

		{#if $$slots.header}
			<header>
				<slot name="header" />
			</header>
		{/if}

		<main>
			<slot name="main" />
		</main>

		{#if $$slots.footer}
			<footer>
				<slot name="footer" />
			</footer>
		{/if}
	</div>
</div>

<style lang="scss">
	.container {
		position: fixed;
		inset: 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;
		pointer-events: none;
		transition: background-color 0.5s;
		overflow-block: auto;
		z-index: 100000000000000;

		&.open {
			pointer-events: auto;
		}

		&.overlay.open {
			background-color: rgba(0, 0, 0, 0.5);
		}

		@media (min-width: 480px) {
			padding: var(--page-gutter);
		}
	}

	.modal {
		--padding: var(--page-gutter);
		--border-radius: 0;

		background-color: var(--surface0);
		flex: 1;
		width: 100%;
		border-radius: var(--border-radius);
		position: relative;
		z-index: 1;
		scale: 0.8;
		opacity: 0;
		transition: opacity 0.2s ease, scale 0.2s ease-in-out;

		@media (min-width: 480px) {
			--padding: 2rem;
			--border-radius: 1rem;

			margin-block: auto;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
			width: 40rem;
			max-width: 100%;
			flex-grow: 0;
		}
	}

	.close-button {
		all: unset;
		position: absolute;
		inset-block-start: 1rem;
		inset-inline-end: 1rem;
		color: var(--text0-muted);
		display: flex;
		cursor: pointer;

		&:focus {
			outline: var(--theme-hover) solid 2px;
		}

		:global(svg) {
			width: 1.5rem;
			height: 1.5rem;
		}
	}

	.container.open .modal {
		opacity: 1;
		scale: 1;
		transition-duration: 0.3s;
	}

	main {
		padding: var(--padding);
	}
</style>
