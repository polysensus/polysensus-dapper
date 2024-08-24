<script lang="ts">
	// --- lib deps
	// --- framework
	// import { onMount , setContext, getContext, onDestroy } from 'svelte'
	// --- external components
	// --- components

	import CarouselGameDiscovery from '$lib/components/organisms/CarouselGameDiscovery.svelte';
	// import ThumbnailsExample from '$lib/components/examples/ThumbnailsExample.svelte';

	// --- app lib
	import { randomImages } from '$lib/utils';
	import { placeholders } from '$lib/utils';
	// --- app stores
	// --- constants
	// --- data imports
	// --- component properties
	let slides: { src: string; alt: string }[] = randomImages('teasers', 6);
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

<div>
	<CarouselGameDiscovery slides={slides} />
</div>


<style>
	/* Add your component styles here */
</style>
