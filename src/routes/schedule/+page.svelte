<script lang="ts">
	import { requireAuth } from "$lib/auth";
	import Schedule from "$lib/skool/schedule/Schedule.svelte";

	requireAuth();
</script>

<Schedule />
