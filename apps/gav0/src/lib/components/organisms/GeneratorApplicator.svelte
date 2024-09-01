<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import ImageLeft from "$lib/components/atoms/ImageLeft.svelte";
// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let image: {src: string, alt: string, styles?:{size?:string, shape?:string}};

if (!image.styles?.size){
  image.styles = {...image.styles, size: 'w-320 h-240'}
}

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
<div class="card">
	<header class="card-header">
    <ImageLeft {image}/>
  </header>
  <p>controls for changing how the generated conent is applied to the game</p>
  <p>the image here is an example of the effects that can be achieved </p>
  <p>the preview (top) will the impact of these controls on the selected item on the left</p>
  {#if $$slots.default}
    <section class="p-4">
      <slot/>
    </section>
  {/if}
  {#if $$slots.footer}
	<footer class="card-footer"><slot name="footer"/></footer>
  {/if}
</div>