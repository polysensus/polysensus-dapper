<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import FormImagePrompt from "$lib/components/molecules/FormImagePrompt.svelte";
// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let title: string = "Image Generator"
export let action: string;
export let placeholder: string = "Describe the image you want";
	
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
<div class="card p-4">{title}</div>
<FormImagePrompt method="POST" action={action} placeholder={placeholder}/>
<style>
</style>