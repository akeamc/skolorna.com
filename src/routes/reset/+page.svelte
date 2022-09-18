<script lang="ts">
	import { page } from "$app/stores";
	import { isError, resetPassword, type AuthError } from "$lib/auth";
	import Button from "$lib/Button.svelte";
	import ErrorText from "$lib/ErrorText.svelte";
	import Field from "$lib/form/Field.svelte";
	import FormCard from "$lib/FormCard.svelte";

	let token = $page.url.searchParams.get("token");
	let email = $page.url.searchParams.get("email") ?? "";
	let password = "";

	let loading = false;
	let sentEmail = false;
	let resetSuccess = false;
	let error: AuthError | null = null;

	function cleanup() {
		token = null;
		password = "";
		loading = false;
		sentEmail = false;
		resetSuccess = false;
		error = null;
	}

	const sendResetLink = async () => {
		loading = true;
		error = null;

		try {
			await resetPassword({ email });

			sentEmail = true;
		} finally {
			loading = false;
		}
	};

	const updatePassword = async () => {
		if (!token) return;

		loading = true;
		error = null;

		try {
			const res = await resetPassword({ token, password });

			if (isError(res)) {
				error = res;
			} else {
				resetSuccess = true;
			}
		} finally {
			loading = false;
		}
	};
</script>

<FormCard>
	<h1>Återställ lösenord</h1>
	{#if resetSuccess}
		<p>Ditt lösenord har återställts. Nu kan du <a href="/login">logga in</a>.</p>
	{:else if token}
		<form on:submit|preventDefault={updatePassword}>
			<Field inputId="password" label="Nytt lösenord">
				<input name="password" id="password" type="password" required bind:value={password} />
			</Field>

			<Button type="submit" disabled={loading}>Återställ lösenord</Button>

			{#if error}
				<ErrorText>
					{#if error.status === 400}
						<!-- svelte-ignore a11y-missing-attribute -->
						Länken är ogiltig eller har gått ut.
						<a role="button" on:click={cleanup}>Skicka en ny länk</a>
					{:else}
						{error.message}
					{/if}
				</ErrorText>
			{/if}
		</form>
	{:else if sentEmail}
		<p>En mejl med instruktioner har skickats till {email}.</p>
	{:else}
		<form on:submit|preventDefault={sendResetLink}>
			<Field inputId="email" label="E-postadress">
				<input name="email" id="email" type="email" required bind:value={email} />
			</Field>

			<Button type="submit" disabled={loading}>Återställ lösenord</Button>
		</form>
	{/if}
</FormCard>
