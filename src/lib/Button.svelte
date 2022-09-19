<script lang="ts">
	export let disabled = false;
	export let type: "button" | "submit" | "reset" = "button";
	export let href: string | undefined = undefined;
	export let variant: "primary" | "secondary" = "primary";
</script>

{#if href}
	<a {href} class="button" class:disabled on:click>
		<slot />
	</a>
{:else}
	<button {type} class={`button ${variant}`} {disabled} on:click>
		<slot />
	</button>
{/if}

<style lang="scss">
	button,
	.button {
		background-color: var(--brand);
		color: var(--on-theme);
		border: 0;
		font-family: var(--font-sans);
		border-radius: 8px;
		height: 3rem;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.1;
		cursor: pointer;
		transition: background-color 0.1s;
		padding-inline: 1.5rem;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		text-decoration: none;

		&:focus {
			outline: var(--theme-hover) solid 2px;
			outline-offset: 2px;
		}

		&:hover {
			background-color: var(--theme-hover);
		}

		&:active {
			background-color: var(--theme-active);
		}

		&.secondary {
			background-color: transparent;
			color: var(--brand);
			border: 1px solid var(--brand);

			&:hover {
				background-color: var(--brand-transparent);
			}

			&:active {
				background-color: var(--brand-transparent-active);
			}
		}
	}

	button:disabled,
	.button.disabled {
		opacity: 0.1;
		cursor: default;
		pointer-events: none;
	}
</style>
