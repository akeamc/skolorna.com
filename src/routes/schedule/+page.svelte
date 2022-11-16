<script lang="ts">
	import { requireAuth } from "$lib/auth/auth";
	import Seo from "$lib/Seo.svelte";
	import Schedule from "$lib/skool/schedule/Schedule.svelte";

	requireAuth();
</script>

<Seo title="Schema" />

<Schedule />
