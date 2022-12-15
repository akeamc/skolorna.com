<script lang="ts">
	import {
		authenticate,
		authenticating,
		isError,
		loginToken,
		type AuthError
	} from "$lib/auth/auth";
	import Button from "$lib/Button.svelte";
	import ErrorText from "$lib/ErrorText.svelte";
	import Field from "$lib/form/Field.svelte";
	import JwtExp from "$lib/util/JwtExp.svelte";
	import { get } from "svelte/store";

	export let otp: string;

	let collapsed = true;
	let error: AuthError | null = null;
	let loading = false;
	let otpInput = "";

	async function login(otp: string) {
		const token = get(loginToken);

		if (!token) {
			console.error("no login token present");
			return;
		}

		error = null;
		loading = true;

		try {
			const res = await authenticate({
				grant_type: "otp",
				token,
				otp
			});

			if (isError(res)) {
				error = res;
			}
		} finally {
			loading = false;
		}
	}

	const handleSubmit: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async () => {
		if (!otpInput) {
			return;
		}

		login(otpInput);
	};
</script>

<h1>Logga in</h1>

{#if $loginToken || $authenticating}
	{#if otp}
		<p style:margin-block-end={"1rem"}>Tryck på knappen för att logga in.</p>
		<Button on:click={() => login(otp)} disabled={loading} size="large">
			{loading ? "Loggar in …" : "Logga in"}
		</Button>
	{:else if collapsed}
		<p>Du har fått ett mejl med inloggningsinstruktioner.</p>
		<!-- svelte-ignore a11y-missing-attribute -->
		<p>
			Om länken inte fungerar kan du <a role="button" on:click={() => (collapsed = false)}
				>ange koden manuellt</a
			>. Du kan också
			<a role="button" on:click={() => ($loginToken = null)}>avbryta inloggningen</a>.
		</p>
	{:else}
		<form on:submit|preventDefault={handleSubmit}>
			<Field inputId="otp" label="Kod">
				<input name="otp" id="otp" type="text" required bind:value={otpInput} />
			</Field>

			<Button type="submit" disabled={loading} size="large">
				{loading ? "Loggar in …" : "Logga in"}
			</Button>
		</form>
	{/if}

	{#if error}
		<ErrorText>Fel kod. Försök igen.</ErrorText>
	{/if}

	{#if $loginToken}
		<p>
			<JwtExp token={$loginToken}>
				<span slot="expired">
					<!-- svelte-ignore a11y-missing-attribute -->
					Länken har gått ut. <a role="button" on:click={() => ($loginToken = null)}>Börja om</a>.
				</span>
				<svelte:fragment slot="expiring" let:expires>Länken går ut {expires}.</svelte:fragment>
			</JwtExp>
		</p>
	{/if}
{:else}
	<p>Av säkerhetsskäl fungerar länken bara på enheten som du loggar in på.</p>
	<p>Ange följande kod på den enheten i stället:</p>
	<code>{otp}</code>
{/if}

<style lang="scss">
	code {
		font-family: var(--font-mono);
		font-size: 1.5rem;
		margin-top: 1rem;
		display: inline-block;
	}
</style>
