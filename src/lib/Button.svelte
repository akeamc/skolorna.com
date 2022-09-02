<script lang="ts">
	export let disabled = false;
	export let type: "button" | "submit" | "reset";
</script>

<button {type} {disabled} on:click>
	<slot />
</button>

<style>
	button {
		background-color: var(--brand);
		color: var(--on-theme);
		border: 0;
		font-family: var(--font-sans);
		border-radius: 8px;
		width: 100%;
		height: 3rem;
		font-size: 14px;
		font-weight: 500;
		line-height: 1;
		cursor: pointer;
		transition: background-color 0.1s;
		padding-inline: 24px;
	}

	button:focus {
		outline: var(--theme-hover) solid 2px;
		outline-offset: 2px;
	}

	button:hover {
		background-color: var(--theme-hover);
	}

	button:active {
		background-color: var(--theme-active);
	}

	button:disabled {
		opacity: 0.1;
		cursor: default;
	}
</style>
