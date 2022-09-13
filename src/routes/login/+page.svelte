<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { authenticate, authenticating, authenticated } from "$lib/auth";
	import Button from "$lib/Button.svelte";
	import Field from "$lib/form/Field.svelte";
	import FormCard from "$lib/FormCard.svelte";

	let next: string;

	$: next = $page.url.searchParams.get("next") ?? "/";

	$: if ($authenticated) {
		goto(next);
	}

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async ({
		target
	}) => {
		const data = new FormData(target as HTMLFormElement);

		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();

		if (!email || !password) {
			return;
		}

		await authenticate({
			grant_type: "password",
			username: email,
			password
		});
	};
</script>

<FormCard>
	<h1>Logga in</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<Field inputId="email" label="E-postadress">
			<input name="email" id="email" type="email" required />
		</Field>

		<Field inputId="password" label="Lösenord">
			<input name="password" id="password" type="password" required />
		</Field>

		<Button type="submit" disabled={$authenticating}>
			{$authenticating ? "Loggar in …" : "Logga in"}
		</Button>

		<p>Har du inget konto? <a href={`/register?next=${next}`}>Skapa ett</a></p>
	</form>
</FormCard>
