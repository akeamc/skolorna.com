<script lang="ts">
	export let title: string | undefined = undefined;

	$: t = title ? `${title} · Skolorna` : "Skolorna";
</script>

<svelte:head>
	<title>{t}</title>
</svelte:head>
