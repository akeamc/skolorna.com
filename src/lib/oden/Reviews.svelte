<script lang="ts">
	import { user } from "$lib/auth/auth";
	import { createReview, getReviews, type Review as ReviewType } from "$lib/oden";
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import Review from "./Review.svelte";

	export let menu: string;
	export let date: string;
	export let meal: string;
	export let enabled = true;
	export let count = 3;

	const client = useQueryClient();

	$: reviews = createQuery({
		queryKey: ["reviews", menu, meal],
		queryFn: () => getReviews({ menu, meal }),
		enabled
	});

	function onMutation() {
		client.invalidateQueries({ queryKey: ["days"] });
	}

	function onDelete(id: string) {
		client.setQueryData<ReviewType[]>(["reviews", menu, meal], (reviews) => {
			if (reviews) return reviews.filter((review) => review.id !== id);
		});
		onMutation();
	}

	$: createReviewMutation = createMutation({
		mutationFn: () => createReview({ menu_id: menu, meal, date, rating, comment }),
		onSuccess: (review) => {
			client.setQueryData<ReviewType[]>(["reviews", menu, meal], (reviews) => {
				if (reviews) return [review, ...reviews];
			});
			onMutation();
			comment = "";
			rating = 0;
		}
	});

	let comment = "";
	let rating = 0;

	$: reviewable =
		!$reviews.isSuccess ||
		!$reviews?.data?.find(
			(review) => review.author && review.author === $user?.id && review.date === date
		);
</script>

<div class="reviews">
	{#if reviewable}
		<Review
			author={$user?.id}
			bind:rating
			bind:comment
			interactive
			on:submit={() => $createReviewMutation.mutate()}
		/>
	{/if}

	{#if $reviews.isSuccess}
		{#each $reviews.data as review}
			<Review {...review} on:delete={() => onDelete(review.id)} />
		{/each}
	{:else}
		{#each new Array(count) as _}
			<Review loading />
		{/each}
	{/if}
</div>

<style lang="scss">
	.reviews {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
