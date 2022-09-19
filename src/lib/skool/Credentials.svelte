<script lang="ts">
	import Button from "$lib/Button.svelte";
	import ButtonGroup from "$lib/ButtonGroup.svelte";
	import ErrorText from "$lib/ErrorText.svelte";
	import Field from "$lib/form/Field.svelte";
	import Skeleton from "$lib/Skeleton.svelte";
	import { DateTime } from "luxon";
	import { deleteCredentials, getCredentials, putCredentials } from "./client";

	let putting = false;
	let deleting = false;
	let error = "";

	$: interactive = !putting && !deleting;

	$: credentials = getCredentials();

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async ({
		target
	}) => {
		const data = new FormData(target as HTMLFormElement);

		const username = data.get("username")?.toString();
		const password = data.get("password")?.toString();

		if (!username || !password) {
			return;
		}

		putting = true;
		error = "";

		try {
			const res = await putCredentials({ service: "skolplattformen", username, password });

			if (res.ok) {
				credentials = res.json();
			} else {
				error =
					res.status === 400
						? "Felaktigt användarnamn eller lösenord."
						: "Något gick fel. Försök igen.";
			}
		} finally {
			putting = false;
		}
	};

	const handleDelete = async () => {
		deleting = true;
		error = "";

		try {
			await deleteCredentials();
			credentials = Promise.resolve(null);
		} catch (_) {
			error = "Något gick fel. Försök igen.";
		} finally {
			deleting = false;
		}
	};
</script>

<div class="root">
	<h2>Inloggningsuppgifter till Skolplattformen</h2>

	{#await credentials}
		<p class="status"><Skeleton width="25ch" /></p>
	{:then credentials}
		<p class="status">
			{#if credentials}
				Du är inloggad som <code>{credentials.username}</code>.
			{:else}
				Du är inte inloggad på Skolplattformen.
			{/if}
		</p>

		{@const updatedAt = credentials?.updated_at
			? DateTime.fromISO(credentials.updated_at).setLocale("sv")
			: undefined}
		<form on:submit|preventDefault={handleSubmit}>
			<Field inputId="username" label="Användarnamn">
				<input
					name="username"
					type="text"
					id="username"
					value={credentials?.username ?? ""}
					placeholder="ab12345"
					required
				/>
			</Field>

			<Field inputId="password" label="Lösenord">
				<input
					name="password"
					type="password"
					id="password"
					required
					placeholder={updatedAt
						? `Ändrades ${updatedAt.toLocaleString(DateTime.DATETIME_MED)}`
						: undefined}
				/>
			</Field>

			{#if error}
				<ErrorText>{error}</ErrorText>
			{/if}

			<ButtonGroup>
				<Button type="submit" disabled={!interactive}>
					{#if putting}
						Sparar …
					{:else if credentials}
						Ändra
					{:else}
						Spara
					{/if}
				</Button>

				<Button
					type="button"
					on:click={handleDelete}
					disabled={!credentials || !interactive}
					variant="secondary"
				>
					Logga ut
				</Button>
			</ButtonGroup>
		</form>
	{:catch error}
		<ErrorText>{error}</ErrorText>
	{/await}
</div>

<style lang="scss">
	.root {
		text-align: start;
	}

	#username {
		font-family: var(--font-mono);
	}

	h2 {
		margin-block: 0 1rem;
		font: 700 1.5rem var(--font-sans);
		letter-spacing: -0.017em;
	}

	.status {
		margin-block: 1rem;
		font: 500 14px var(--font-sans);
		color: var(--text1);
		color: var(--text0-muted);
		font-style: italic;
	}

	.root :global(p) {
		margin-block-end: 1rem;
	}
</style>
