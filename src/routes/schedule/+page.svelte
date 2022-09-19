<script lang="ts">
	import { navigating } from "$app/stores";
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { authenticated } from "$lib/auth";
	import Schedule from "$lib/skool/schedule/Schedule.svelte";

	$: if (browser && !$authenticated && !$navigating) {
		goto("/login?next=/schedule");
	}
</script>

<Schedule />
