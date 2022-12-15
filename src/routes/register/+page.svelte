<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import {
		authenticating,
		authenticated,
		register,
		loginToken,
		type AuthError,
		isError
	} from "$lib/auth/auth";
	import Button from "$lib/Button.svelte";
	import ErrorText from "$lib/ErrorText.svelte";
	import Field from "$lib/form/Field.svelte";
	import FormCard from "$lib/FormCard.svelte";
	import Seo from "$lib/Seo.svelte";

	$: if ($authenticated) {
		goto($page.url.searchParams.get("next") || "/");
	}

	$: if ($loginToken) {
		goto("/login");
	}

	let email = $page.url.searchParams.get("email") ?? "";
	let name = "";

	let error: AuthError | null = null;

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async () => {
		if (!name || !email) {
			return;
		}

		error = null;

		const res = await register({
			full_name: name,
			email
		});

		if (isError(res)) {
			error = res;
		}
	};
</script>

<Seo title="Skapa konto" />

<FormCard browserOnly>
	<h1>Skapa konto</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<Field inputId="name" label="Namn">
			<input name="name" id="name" type="text" required bind:value={name} />
		</Field>

		<Field inputId="email" label="E-postadress">
			<input name="email" id="email" type="email" required bind:value={email} />
		</Field>

		<Button type="submit" disabled={$authenticating} size="large">
			{$authenticating ? "Skapar konto …" : "Fortsätt"}
		</Button>

		{#if error}
			<ErrorText>
				{error.message}
			</ErrorText>
		{/if}

		<p>Har du redan ett konto? <a href="/login">Logga in</a></p>
	</form>
</FormCard>
