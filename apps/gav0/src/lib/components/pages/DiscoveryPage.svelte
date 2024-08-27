<script lang="ts">
	// --- lib deps
	import { sevenGameSelector as selector } from '$lib/placeholders/gamediscoveryselectors';
	// --- framework
	import { onMount } from 'svelte';
	// --- external components
	// --- components

	import CarouselGameDiscovery from '$lib/components/organisms/CarouselGameDiscovery.svelte';
	import CarouselGameDiscoverySelectedGame from '$lib/components/organisms/CarouselGameDiscoverySelectedGame.svelte';

	// import ThumbnailsExample from '$lib/components/examples/ThumbnailsExample.svelte';

	// --- app lib
	// --- app stores
	// --- constants
	// --- data imports
	// --- component properties
	let slides: { src: string; alt: string }[] = selector.teasers.map((about) => ({
		src: about.imageUrl,
		alt: about.title
	}));
	let selected = selector.idOf(0);
	// let selected = 'shrapnel-2024';

	// --- component state properties
	// --- svelte bound variables
	// let instance = undefined
	// --- svelte lifecycle callbacks
	// test support hook
	// onMount(async () => {})
	// --- on event callbacks
	function onSliderMoved(event) {
		console.log('slider moved', event.detail);
		selected = selector.idOf(event.detail.index);

		selector.select(selected);
	}
	// --- contract state callbacks
	onMount(() => {
		selector.select(selected);
	});
	// --- component helpers
</script>

<div>
	<CarouselGameDiscovery on:moved={onSliderMoved} {slides} />
</div>
<div>
	<CarouselGameDiscoverySelectedGame {selector} {selected} />
</div>

<style>
	/* Add your component styles here */
</style>
