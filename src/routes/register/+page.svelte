<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { authenticating, authenticated, register } from "$lib/auth";
	import Button from "$lib/Button.svelte";
	import FormCard from "$lib/FormCard.svelte";

	$: if ($authenticated) {
		goto($page.url.searchParams.get("next") || "/");
	}

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async ({
		target
	}) => {
		const data = new FormData(target as HTMLFormElement);

		const name = data.get("name")?.toString();
		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();

		if (!name || !email || !password) {
			return;
		}

		await register({
			full_name: name,
			email,
			password
		});
	};
</script>

<FormCard>
	<h1>Skapa konto</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<label for="name">Namn</label>
		<input name="name" id="name" type="text" />

		<label for="email">E-postadress</label>
		<input name="email" id="email" type="email" />

		<label for="password">Lösenord</label>
		<input name="password" id="password" type="password" />

		<Button type="submit" disabled={$authenticating}>
			{$authenticating ? "Skapar konto …" : "Fortsätt"}
		</Button>

		<p>Har du redan ett konto? <a href="/login">Logga in</a></p>
	</form>
</FormCard>
