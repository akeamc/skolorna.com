<script lang="ts">
	import { onMount } from "svelte";

	let el: HTMLCanvasElement;

	$: R = el?.width / 3;
	$: fogStart = R / 4;
	$: fogFade = el?.width / 12;
  const r0 = 6;

	interface Particle {
		distance: number;
		angle: number;
	}

	$: particles = Array.from({ length: 20 }, () => {
		const distance = R + r0 + Math.random() * (R + fogStart + fogFade);
		const angle = Math.random() * Math.PI * 2;
		return { distance, angle } as Particle;
	});

	let lastFrame = 0;

	const draw: FrameRequestCallback = (now) => {
		const style = getComputedStyle(el);

		const delta = now - lastFrame;

		const bg = style.getPropertyValue("--color");

		const ctx = el.getContext("2d");
		if (!ctx) return;

		ctx.save();

		ctx.clearRect(0, 0, el.width, el.height);

		const cx = el.width / 2;
		const cy = el.height / 2;

		ctx.fillStyle = bg;
    ctx.shadowColor = bg;
    ctx.shadowBlur = 20;

		for (let i = 0; i < particles.length; i++) {
			let p = particles[i];

			p.distance -= (delta * el.width) / 10000;

			const r = r0 * (1 - Math.max(0, (p.distance - R - fogStart) / fogFade));

			if (p.distance + r < R) {
				p.distance = fogStart + fogFade + R + r0 + Math.random() * R;
				p.angle = Math.random() * Math.PI * 2;
        continue;
			}

			const x = cx + Math.cos(p.angle) * p.distance;
			const y = cy + Math.sin(p.angle) * p.distance;

			if (r > 0) {
				ctx.beginPath();
				ctx.arc(x, y, r, 0, 2 * Math.PI);
				ctx.fill();
			}
		}

		lastFrame = now;

		ctx.restore();
	};

	onMount(() => {
		const loop: FrameRequestCallback = (now) => {
			draw(now);
			handle = requestAnimationFrame(loop);
		};

		let handle = requestAnimationFrame(loop);

		return () => cancelAnimationFrame(handle);
	});
</script>

<canvas bind:this={el} width="600" height="600" />

<style lang="scss">
	canvas {
		display: block;
		position: absolute;
		inset: 0;
		width: var(--bg-width);
		margin: auto;
	}
</style>
