<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import ImagePrompt from "./ImagePrompt.svelte";
// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let panels: {id:number; text: string; image?:{src:string, alt:string}}[] = [];
export let stride: number;
export let strideWide: number = stride;
export let heightCss = 'h-[25rem]';

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

<ImagePrompt {panels} {stride} {strideWide} buttonText="Generate" suggestion="Describe how your blueprint differs from the base image"/>