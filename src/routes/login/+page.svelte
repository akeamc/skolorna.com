<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { authenticated, loginToken } from "$lib/auth";
	import LoginForm from "$lib/auth/LoginForm.svelte";
	import OtpForm from "$lib/auth/OtpForm.svelte";
	import FormCard from "$lib/FormCard.svelte";

	let next: string;
	let otp: string;

	$: next = $page.url.searchParams.get("next") ?? "/";
	$: otp = $page.url.searchParams.get("otp") ?? "";

	$: if ($authenticated) {
		goto(next);
	}
</script>

<FormCard browserOnly>
	{#if $loginToken || otp}
		<OtpForm {otp} />
	{:else}
		<LoginForm />
	{/if}
</FormCard>
