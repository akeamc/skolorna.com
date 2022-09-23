<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { authenticating, authenticated, register, type AuthError, isError } from "$lib/auth";
	import Button from "$lib/Button.svelte";
	import ErrorText from "$lib/ErrorText.svelte";
	import Field from "$lib/form/Field.svelte";
	import FormCard from "$lib/FormCard.svelte";

	$: if ($authenticated) {
		goto($page.url.searchParams.get("next") || "/");
	}

	let email = $page.url.searchParams.get("email") ?? "";
	let password = "";
	let name = "";

	let error: AuthError | null = null;

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async () => {
		if (!name || !email || !password) {
			return;
		}

		error = null;

		const res = await register({
			full_name: name,
			email,
			password
		});

		if (isError(res)) {
			error = res;
		}
	};
</script>

<FormCard>
	<h1>Skapa konto</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<Field inputId="name" label="Namn">
			<input name="name" id="name" type="text" required bind:value={name} />
		</Field>

		<Field inputId="email" label="E-postadress">
			<input name="email" id="email" type="email" required bind:value={email} />
		</Field>

		<Field inputId="password" label="Lösenord">
			<input name="password" id="password" type="password" required bind:value={password} />
		</Field>

		<Button type="submit" disabled={$authenticating}>
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
