<script lang="ts">
	export let title: string | undefined = undefined;
</script>

<svelte:head>
	{#if title}
		<title>{title} · Skolorna</title>
	{:else}
		<title>Skolorna</title>
	{/if}
</svelte:head>
