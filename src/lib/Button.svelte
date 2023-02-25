<script lang="ts">
	export let disabled = false;
	export let type: "button" | "submit" | "reset" = "button";
	export let href: string | undefined = undefined;
	export let variant: "primary" | "secondary" | "tetriary" = "primary";
	export let color: "normal" | "danger" = "normal";
	export let size: "small" | "medium" | "large";

	let element: HTMLElement;

	$: className = `button ${variant} ${size} ${color} ${
		element?.innerText === "" ? "icon-only" : ""
	}`;
</script>

{#if href}
	<a {href} class={className} class:disabled on:click bind:this={element}>
		<slot />
	</a>
{:else}
	<button {type} class={className} {disabled} on:click bind:this={element}>
		<slot />
	</button>
{/if}

<style lang="scss">
	button,
	.button {
		background-color: var(--bg);
		color: var(--fg);
		border: 0;
		font-family: var(--font-sans);
		border-radius: 0.5rem;
		font-weight: 500;
		line-height: 1.1;
		cursor: pointer;
		transition: background-color 0.1s, outline-offset 0.1s;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		text-decoration: none;
		user-select: none;
		gap: 0.5rem;

		&:focus-visible {
			outline: var(--outline) solid 2px;
			outline-offset: 2px;
		}

		&:hover {
			background-color: var(--bg-hover);
		}

		&:active {
			background-color: var(--bg-active);
			outline-offset: 0;
		}

		&.secondary,
		&.tetriary {
			background-color: transparent;
			color: var(--bg);

			&:hover {
				background-color: var(--bg-transparent);
			}

			&:active {
				background-color: var(--bg-transparent-active);
			}
		}

		&.secondary {
			border: 1px solid var(--bg);
		}

		:global(svg) {
			height: 1rem;
			width: 1rem;
		}
	}

	button:disabled,
	.button.disabled {
		opacity: 0.1;
		cursor: default;
		pointer-events: none;
	}

	.small {
		height: 2rem;
		font-size: 0.75rem;
		padding-inline: 1rem;
	}

	.medium {
		height: 2.25rem;
		font-size: 0.875rem;
		padding-inline: 1.25rem;
	}

	.large {
		height: 2.5rem;
		font-size: 0.875rem;
		padding-inline: 1.5rem;
	}

	.icon-only {
		padding-inline: 0.5rem;
	}

	.normal {
		--bg: var(--brand);
		--fg: var(--on-theme);
		--outline: var(--theme-hover);
		--bg-hover: var(--theme-hover);
		--bg-active: var(--theme-active);
		--bg-transparent: var(--brand-transparent);
		--bg-transparent-active: var(--brand-transparent-active);
	}

	.danger {
		--bg: red;
		--bg-transparent: rgba(255, 0, 0, 0.178);
	}
</style>
