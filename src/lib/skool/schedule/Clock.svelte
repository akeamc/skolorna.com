<script lang="ts">
	import { onMount } from "svelte";


  let time = new Date();
  
  $: hour = time.getHours().toString().padStart(2, "0");
  $: minute = time.getMinutes().toString().padStart(2, "0");

  onMount(() => {
    const interval = setInterval(() => {
			time = new Date();
		}, 1000);
    
		return () => {
			clearInterval(interval);
		};
	});
  </script>

<div style:--seconds={time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()}>
  <span>{hour}:{minute}</span>
</div>

<style lang="scss">
  div {
    position: absolute;
    top: calc((var(--seconds) - var(--offset)) * var(--second-height));
  }

  span {
    display: inline-block;
    font-feature-settings: "tnum";
    background: red;
    color: white;
  }
</style>
