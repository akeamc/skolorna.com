<script lang="ts">
	import type { TableDialog } from "./schedule";

	export let dialog: TableDialog;
</script>

<div class="dialog" style:--x={`${dialog.rect.x}px`} style:--y={`${dialog.rect.y}px`}>
	{dialog.lesson.course}
</div>

<style lang="scss">
	.dialog {
		position: absolute;
		top: var(--y);
		left: var(--x);
	}
</style>
