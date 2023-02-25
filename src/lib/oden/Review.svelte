<script lang="ts">
	import { page } from "$app/stores";
	import { authenticated, getProfile, user } from "$lib/auth/auth";
	import Button from "$lib/Button.svelte";
	import { deleteReview } from "$lib/oden";
	import Stars from "$lib/rating/Stars.svelte";
	import Skeleton from "$lib/Skeleton.svelte";
	import { createMutation, createQuery } from "@tanstack/svelte-query";
	import { DateTime } from "luxon";
	import { createEventDispatcher } from "svelte";

	export let author: string | undefined = undefined;
	export let rating: number | undefined = undefined;
	export let created_at: string | undefined = undefined;
	export let comment: string | null | undefined = undefined;
	export let id: string | undefined = undefined;
	export let loading = false;
	export let interactive = false;

	const dispatch = createEventDispatcher();

	$: deleteMutation = createMutation({
		mutationFn: async () => {
			if (id) await deleteReview(id);
		},
		onSuccess: () => dispatch("delete")
	});

	$: deletable = id && author && author === $user?.id;

	$: authorQuery = createQuery({
		queryKey: ["user", author, "profile"],
		queryFn: () => getProfile(author!),
		enabled: !!author
	});

	$: valid = rating !== undefined && rating > 0;
	$: disabled = !$authenticated;
</script>

<div class="review">
	<div class="author">
		{#if $authorQuery.isSuccess}
			{$authorQuery.data.full_name}
		{:else}
			<Skeleton width="12ch" />
		{/if}
	</div>

	<div class="rating">
		<div class="stars">
			<Stars bind:rating {interactive} />
		</div>
		{#if created_at}
			<span>
				{DateTime.fromISO(created_at).toLocaleString(DateTime.DATE_MED)}
			</span>
		{:else if loading}
			<Skeleton width="10ch" />
		{/if}
	</div>

	{#if interactive}
		<textarea
			class="comment"
			bind:value={comment}
			placeholder="Eventuell kommentar"
			rows="4"
			{disabled}
		/>
	{:else if comment}
		<p class="comment">
			{comment}
		</p>
	{:else if loading}
		<p class="comment">
			<Skeleton width="20ch" />
		</p>
	{/if}

	<div class="actions">
		{#if interactive}
			{#if $user}
				<Button size="small" on:click={() => dispatch("submit")} disabled={!valid}>Publicera</Button
				>
			{:else}
				<a href={`/login?next=${$page.url.pathname}`}>Logga in</a> för att recensera
			{/if}
		{/if}

		{#if deletable}
			<Button size="small" on:click={() => $deleteMutation.mutate()}>Radera</Button>
		{/if}
	</div>
</div>

<style lang="scss">
	.review {
		border: 1px solid var(--outline);
		border-radius: 0.5rem;
		padding: 0.5rem;
		max-width: 30rem;
		font: 500 0.875rem/1 var(--font-sans);
		letter-spacing: -0.006em;
		color: var(--text0-muted);
	}

	.author {
		color: var(--text0);
		margin-block-end: 0.75rem;
	}

	.rating {
		display: flex;
		gap: 0.25rem;
		color: var(--text0-muted);
	}

	textarea.comment {
		color: var(--text0);
		outline: none;
		border: none;
		resize: none;
		display: block;
		font: inherit;
		padding: 0.5rem;
		border-radius: 0.25rem;
		width: 100%;
		box-sizing: border-box;
		background-color: var(--surface1);
		border: 1px solid var(--outline);

		&:focus {
			border-color: var(--theme-hover);
		}

		&::placeholder {
			color: var(--text0-muted);
		}
	}

	.comment {
		margin-block: 0.5rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
		justify-content: flex-end;
		align-items: center;
	}
</style>
