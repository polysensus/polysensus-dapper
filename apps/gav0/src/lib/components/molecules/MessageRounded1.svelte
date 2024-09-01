<script lang="ts">
// --- lib deps
// import { createEventDispatcher } from 'svelte';
// 
// const dispatch = createEventDispatcher();

// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let id: number;
export let text = 'Loerm ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.';
export let image: {src: string, alt: string} | undefined = undefined;
export let dims: {image: {w: string, h: string}, text: {w: string, h: string}}
  = { image:{w: 'w-64', h: 'h-64'}, text: {w: 'max-w-xs', h: ''}};
// --- component state properties
// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers
</script>
<div
  class="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4">
  {#if image?.src}
    <img
      class="mr-2 flex {dims.image.w} {dims.image.h} rounded-full sm:mr-4"
      src={image.src}
      alt={image.alt}
    />
  {/if}

  <div class="flex {dims.text.w} {dims.text.h} items-center rounded-xl">
    <!--<slot/> -->
    <p> {text} </p>
  </div>
</div>