<script lang="ts">
	import { onMount } from "svelte";

	let container: HTMLDivElement;

	onMount(() => {
		google.accounts.id.renderButton(container, {
			type: "standard",
			size: "large",
			text: "continue_with"
		});
	});
</script>

<div bind:this={container} />

<style>
	div {
		margin-block: 1rem;
	}
</style>
