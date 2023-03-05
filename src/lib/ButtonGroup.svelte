<script lang="ts">
	type Justify = "flex-start" | "flex-end" | "space-between";

	export let justify: Justify = "flex-start";
</script>

<div style:justify-content={justify}>
	<slot />
</div>

<style lang="scss">
	div {
		display: flex;
		gap: 0.5rem;
	}
</style>
