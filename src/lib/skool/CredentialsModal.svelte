<script lang="ts">
	import { goto } from "$app/navigation";
	import Modal from "$lib/Modal.svelte";
	import logo from "$lib/assets/sterik.svg";
	import { hasCredentials } from "./stores";
	import Credentials from "./Credentials.svelte";
</script>

<Modal open={$hasCredentials === false} onClose={() => goto("/")} width="narrow">
	<div class="header" slot="header">
		<div class="logo">
			<img alt="Sankt Erik med solglasögon" src={logo} />
		</div>
	</div>
	<div slot="main">
		<Credentials />
	</div>
</Modal>

<style lang="scss">
	@use "../../styles/mixins";

	.header {
		@include mixins.dotted-background;

		padding: var(--padding);
		border-start-start-radius: var(--border-radius);
		border-start-end-radius: var(--border-radius);
		display: flex;
		justify-content: center;
	}

	.logo {
		max-width: 8rem;
		display: flex;
		aspect-ratio: 1;
		background-color: var(--surface0);
		border-radius: 50%;
		box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
	}

	img {
		display: block;
		width: 100%;
		object-fit: contain;
		margin: 20%;

		@media (prefers-color-scheme: dark) {
			filter: saturate(0.5);
		}
	}
</style>
