<script lang="ts">
	import { logout, requireAuth, updateProfile, user } from "$lib/auth/auth";
	import Button from "$lib/Button.svelte";
	import Credentials from "$lib/skool/Credentials.svelte";
	import Seo from "$lib/Seo.svelte";
	import Field from "$lib/form/Field.svelte";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";

	requireAuth();

	const client = useQueryClient();

	const profileMutation = createMutation({
		mutationFn: updateProfile,
		onSuccess: (data) => {
			client.invalidateQueries(["profile", data.id]);
		}
	});

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async ({
		target
	}) => {
		const data = new FormData(target as HTMLFormElement);
		const full_name = data.get("fullName")?.toString();

		await $profileMutation.mutate({ full_name });
	};
</script>

<Seo title="Konto" />

<div class="root">
	<h1>Konto</h1>

	<section>
		<h2>Profil</h2>

		<form on:submit|preventDefault={handleSubmit}>
			<Field inputId="fullName" label="Namn" skeleton={!$user}>
				<input name="fullName" type="text" id="fullName" value={$user?.full_name || ""} />
			</Field>
			<Button type="submit" size="medium" disabled={$profileMutation.isLoading}>Spara</Button>
		</form>
	</section>

	<section>
		<Credentials />
	</section>

	<Button on:click={() => logout("/")} size="large">Logga ut</Button>
</div>

<style lang="scss">
	.root {
		max-width: var(--content-width);
		margin: 0 auto;
		padding: 0 var(--page-gutter);
	}

	section {
		border-radius: 0.5rem;
		border: 1px solid var(--outline);
		padding: 1rem;
		margin-block: 2rem;
		text-align: start;

		:global(input) {
			max-width: 20rem;
		}

		h2 {
			margin-block: 0 1rem;
			font: 700 1.5rem var(--font-sans);
			letter-spacing: -0.017em;
		}
	}
</style>
