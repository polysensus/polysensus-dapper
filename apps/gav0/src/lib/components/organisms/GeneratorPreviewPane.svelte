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

// --- component state properties
let styles: {size?:string, shape?:string} | {};
$: {
  styles = image.styles ?? {}
  if (!styles?.size)
    styles = {...image.styles, size: 'w-320 h-240'}
}
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
    <ImageLeft image={image}/>
  </header>
  <p>preview how the generated conent will look in the game</p>
  <p>the preview is of the selected item on the left</p>
  {#if $$slots.default}
    <section class="p-4">
      <slot/>
    </section>
  {/if}
  {#if $$slots.footer}
	<footer class="card-footer"><slot name="footer"/></footer>
  {/if}
</div>