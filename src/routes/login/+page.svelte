<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { authenticate, authenticating, authenticated, isError, type AuthError } from "$lib/auth";
	import Button from "$lib/Button.svelte";
	import ErrorText from "$lib/ErrorText.svelte";
	import Field from "$lib/form/Field.svelte";
	import FormCard from "$lib/FormCard.svelte";

	let next: string;
	let error: AuthError | null = null;

	let email = "";
	let password = "";

	$: next = $page.url.searchParams.get("next") ?? "/";

	$: if ($authenticated) {
		goto(next);
	}

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async () => {
		if (!email || !password) {
			return;
		}

		error = null;

		const res = await authenticate({
			grant_type: "password",
			username: email,
			password
		});

		if (isError(res)) {
			error = res;
		}
	};
</script>

<FormCard>
	<h1>Logga in</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<Field inputId="email" label="E-postadress">
			<input name="email" id="email" type="email" required bind:value={email} />
		</Field>

		<Field inputId="password" label="Lösenord">
			<input name="password" id="password" type="password" required bind:value={password} />
		</Field>

		<Button type="submit" disabled={$authenticating}>
			{$authenticating ? "Loggar in …" : "Logga in"}
		</Button>

		{#if error}
			<ErrorText>
				{#if error.status === 401}
					Fel e-postadress eller lösenord. <a href={`/reset?email=${email}`}>Återställ lösenord</a>
				{:else}
					Något gick fel. Försök igen.
				{/if}
			</ErrorText>
		{/if}

		<p>Har du inget konto? <a href={`/register?next=${next}`}>Skapa ett</a></p>
	</form>
</FormCard>
