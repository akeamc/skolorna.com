<script lang="ts">
	import { isError, type AuthError, login } from "$lib/auth";
	import Button from "$lib/Button.svelte";
	import ErrorText from "$lib/ErrorText.svelte";
	import Field from "$lib/form/Field.svelte";

	let next: string;
	let error: AuthError | null = null;
	let loading = false;

	let email = "";

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async () => {
		if (!email) {
			return;
		}

		loading = true;
		error = null;

		try {
			const res = await login(email);

			if (isError(res)) {
				error = res;
			}
		} finally {
			loading = false;
		}
	};
</script>

<h1>Logga in</h1>

<form on:submit|preventDefault={handleSubmit}>
	<Field inputId="email" label="E-postadress">
		<input name="email" id="email" type="email" required bind:value={email} />
	</Field>

	<Button type="submit" disabled={loading}>
		{loading ? "Loggar in …" : "Logga in"}
	</Button>

	{#if error}
		<ErrorText>
			{#if error.status === 400}
				Inget konto med den e-postadressen hittades. Vill du <a
					href={`/register?next=${next}&email=${email}`}>skapa ett</a
				>?
			{:else}
				Något gick fel. Försök igen.
			{/if}
		</ErrorText>
	{/if}

	<p>Har du inget konto? <a href={`/register?next=${next}`}>Skapa ett</a></p>
</form>
