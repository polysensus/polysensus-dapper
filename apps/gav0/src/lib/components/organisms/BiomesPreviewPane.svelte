<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import GeneratorPreviewPane from "./GeneratorPreviewPane.svelte";
// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let image: {src: string, alt: string, styles?:{size?:string, shape?:string}};
export let meta: {generatorType: string};
// content interpretation dependent on generatorType

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
<GeneratorPreviewPane {image}>
  <p>Biomes generator preview</p>
  {#if meta.generatorType === 'graffiti'}
    <p>Biomes generator type: graffiti</p>
  {:else if meta.generatorType === 'blueprints'}
    <p>Biomes generator type: blueprints</p>
  {:else}
    <p>Biomes generator type: unknown</p>
  {/if}
</GeneratorPreviewPane>
<style>
</style>