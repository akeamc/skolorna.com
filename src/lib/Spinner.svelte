<div class="spinner" />

<style lang="scss">
	.spinner {
		display: inline-block;
		position: relative;
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top-color: var(--text0-muted);
		border-radius: 50%;
		box-sizing: border-box;
		animation: spin 0.4s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
