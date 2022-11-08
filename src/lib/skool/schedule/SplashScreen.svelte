<script lang="ts">
	import logo from "$lib/assets/sterik.svg";
</script>

<div class="container">
	<div class="logo">
		<img src={logo} alt="Sankt Erik med solglasögon" />
		<div class="wave" />
	</div>
	<h1>Skålplattformen™</h1>
	<p>Läser in <i>The cooler Skolplattformen</i>.</p>
</div>

<style lang="scss">
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - var(--header-height));
		overflow: hidden;
		flex-direction: column;
		text-align: center;
		padding: var(--page-gutter);
		box-sizing: border-box;
	}

	.logo {
		--size: clamp(6rem, 20vw, 12rem);
		--filter: saturate(1);

		@media (prefers-color-scheme: dark) {
			--filter: saturate(0.5);
		}

		width: var(--size);
		height: var(--size);
		position: relative;
	}

	img {
		width: var(--size);
		height: var(--size);
		animation: 1s enter forwards, 0.75s pulse 2s infinite alternate;
		object-fit: contain;
	}

	.wave {
		content: "";
		display: block;
		position: absolute;
		inset: 0;
		background: var(--surface2);
		border-radius: 50%;
		z-index: -1;
		animation: 1s ripple 0.2s forwards;
		opacity: 0.8;
		transform: scale(0);
	}

	h1 {
		font: 700 1.5rem/1 var(--font-sans);
		letter-spacing: -0.022em;
		color: var(--text0);
		margin-block: 2rem 1rem;
	}

	p {
		font: 400 1rem/1 var(--font-sans);
		color: var(--text0-muted);
		margin: 0;
	}

	@keyframes enter {
		0% {
			filter: saturate(0);
			transform: scale(0.5);
		}
		100% {
			filter: var(--filter);
			transform: scale(1);
		}
	}

	@keyframes pulse {
		to {
			transform: scale(1.1);
		}
	}

	@keyframes ripple {
		to {
			transform: scale(2);
			opacity: 0;
		}
	}
</style>
