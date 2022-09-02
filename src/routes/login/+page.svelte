<script lang="ts">
	import { authorize } from "$lib/auth";
	import Button from "$lib/Button.svelte";

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async ({
		target
	}) => {
		const data = new FormData(target as HTMLFormElement);

		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();

		if (!email || !password) {
			return;
		}

		await authorize({
			grant_type: "password",
			username: email,
			password
		});
	};
</script>

<div class="root">
	<div class="card">
		<h1>Logga in</h1>

		<form on:submit|preventDefault={handleSubmit}>
			<label for="email">E-postadress</label>
			<input name="email" id="email" type="email" />
			<label for="password">Lösenord</label>
			<input name="password" id="password" type="password" />

			<p>Har du inget konto? <a href="/registrera">Skapa ett</a></p>

			<Button type="submit">Logga in</Button>
		</form>
	</div>
</div>

<style lang="scss">
	.root {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: calc(100vh - var(--header-height));
	}

	.card {
		padding: 0;
		margin: calc(var(--header-height) + var(--page-gutter)) 0;
		text-align: center;
	}

	@media (min-width: 480px) {
		.root {
			background-color: var(--surface1);
			justify-content: center;
		}

		.card {
			padding: var(--page-gutter);
			width: 400px;
			border-radius: 12px;
			box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
			background-color: var(--surface0);
		}
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		margin: 1rem 0;
	}

	form {
		text-align: start;
	}

	input {
		height: 3rem;
		border: 1px solid var(--outline);
		border-radius: 8px;
		width: 100%;
		margin-block-start: 0.5rem;
		margin-block-end: 1.5rem;
		background-color: var(--surface1);
		padding-inline: 8px;
		font-family: var(--font-sans);
		font-size: 14px;
		color: inherit;
		box-sizing: border-box;

		&:focus {
			outline: var(--theme-hover) solid 2px;
			outline-offset: -1px;
		}
	}

	label {
		font: 500 14px/1 var(--font-sans);
	}
</style>
