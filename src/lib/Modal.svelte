<script lang="ts">
	export let open: boolean;

	export let overlay = true;
	/**
	 * Modal close handler. If no function is provided, the modal won't be closable (no close button will be shown).
	 */
	export let onClose: (() => void) | undefined = undefined;

	import { XIcon } from "svelte-feather-icons";
</script>

<div class="container" class:open>
	<div class="overlay" on:click={onClose} />

	<div class="modal">
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
		justify-content: center;
		align-items: center;
		flex-direction: column;
		z-index: 1;
		pointer-events: none;

		&.open {
			pointer-events: auto;
		}
	}

	.overlay {
		background-color: rgba(0, 0, 0, 0.5);
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.5s;
	}

	.container.open .overlay {
		opacity: 1;
	}

	.modal {
		--padding: var(--page-gutter);
		--border-radius: 0;

		background-color: var(--surface0);
		margin: 0;
		flex: 1;
		max-width: 100%;
		border-radius: var(--border-radius);
		position: relative;
		z-index: 1;
		scale: 0.8;
		opacity: 0;
		transition: all 0.3s ease-in-out;

		@media (min-width: 480px) {
			--padding: 2rem;
			--border-radius: 1rem;

			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
			width: 40rem;
			flex: 0;
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
	}

	main {
		padding: var(--padding);
	}
</style>
