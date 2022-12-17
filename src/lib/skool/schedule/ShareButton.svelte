<script lang="ts">
	import Button from "$lib/Button.svelte";
	import Modal from "$lib/Modal.svelte";
	import { ShareIcon } from "svelte-feather-icons";

	let open = false;
</script>

<Button size="medium" variant="secondary" on:click={() => (open = true)}><ShareIcon />Dela</Button>

<Modal {open} onClose={() => (open = false)}>
	<div slot="main">
		<h1>Modal</h1>
	</div>
</Modal>
