<script lang="ts">
  export let days: number;

	import Background from "./Background.svelte";

</script>

<div class="root">
  <svg width="600" height="340" viewBox="0 0 600 340" shape-rendering="optimizeSpeed">
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
      </filter>
    </defs>

    <g class="main">
      <circle class="blob" cx="50%" cy="50%" r="120" />
    </g>
    <circle class="glow" cx="50%" cy="50%" r="140" />
    <text class="days" x="50%" y="50%">{days.toLocaleString("sv")}</text>
  </svg>
  <Background />
</div>

<style lang="scss">
  .root {
    --color: var(--brand);
    --bg-width: 340px;

    // filter: drop-shadow(0 0 100px var(--brand));
    position: relative;
  }
  
  svg {

    circle, path {
      shape-rendering: geometricPrecision;
    }
  }

  .blob {
    fill: var(--color);
    position: relative;
    z-index: 1;
  }

  .glow {
    fill: var(--color);
    fill-opacity: 0.2;
    animation: vibe 2s ease-in-out infinite;
    transform-origin: 50%;
  }
  
  .days {
    font: 800 40px/1.2 var(--font-sans);
    letter-spacing: -0.022em;
    fill: #fff;
    text-anchor: middle;
    dominant-baseline: middle;
    text-shadow: 0 0px 10px var(--theme-active);
    position: relative;
    z-index: 2;
  }

  @keyframes vibe {
    0% {
      transform: scale(0.7);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.7);
    }
  }
</style>
