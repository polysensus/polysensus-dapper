<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import FormPrompt1 from "$lib/components/molecules/FormPrompt1.svelte";
// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let panels: {id:number; text: string; image?:{src:string, alt:string}}[] = [];
export let stride: number;
export let strideWide: number = stride;
export let buttonText: string;
export let suggestion: string;
export let promptPos: "top" | "bottom" = "top";

// --- component state properties
// $: gridStyles = `grid grid-cols-${stride} md:grid-cols-${strideWide} gap-4`
let gridStyles = `grid grid-cols-2 md:grid-cols-2 gap-4`

// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers
</script>

{#if promptPos === "top"}
<div class="mb-4">
<FormPrompt1 {buttonText} {suggestion}/>
</div>
{/if}

<section class={gridStyles}>
  {#each panels as panel, i (panel.id)}
    <div class="relative h-0 pb-[100%]">
      <img class="absolute top-0 left-0 w-full h-full object-cover rounded-lg" src={panel?.image?.src} alt={panel?.image?.alt}>
    </div>
  {/each}
</section>
{#if promptPos === "bottom"}
<div class="mb-4">
<FormPrompt1 {buttonText} {suggestion}/>
</div>
{/if}
