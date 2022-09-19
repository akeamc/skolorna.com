<script lang="ts">
	export let width = "100%";
	export let height = "1em";
</script>

<span class="skeleton" style:width style:height />

<style lang="scss">
	.skeleton {
		background-color: var(--surface2);
		background-repeat: no-repeat;
		background-size: 100vw 100%;
		border-radius: 0.75rem;
		display: inline-block;
		line-height: 1;
		max-width: 100%;
	}
</style>
