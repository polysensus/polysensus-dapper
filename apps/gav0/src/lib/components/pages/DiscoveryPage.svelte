<script lang="ts">
	// --- lib deps
	import { sixGameSelector as selector } from '$lib/placeholders/gamediscoveryselectors';
	// --- framework
	// import { onMount , setContext, getContext, onDestroy } from 'svelte'
	// --- external components
	// --- components

	import CarouselGameDiscovery from '$lib/components/organisms/CarouselGameDiscovery.svelte';
	import CarouselGameDiscoverySelectedGame from '$lib/components/organisms/CarouselGameDiscoverySelectedGame.svelte';

	// import ThumbnailsExample from '$lib/components/examples/ThumbnailsExample.svelte';

	// --- app lib
	import { randomImages } from '$lib/utils';
	// --- app stores
	// --- constants
	// --- data imports
	// --- component properties
	let slides: { src: string; alt: string }[] = randomImages('teasers', 6);
	let selected = 'game-2';
	// --- component state properties
	// --- svelte bound variables
	// let instance = undefined
	// --- svelte lifecycle callbacks
	// test support hook
	// onMount(async () => {})
	// --- on event callbacks
	function onSliderMoved(event) {
		console.log('slider moved', event.detail);
		selected = `game-${event.detail.index + 1}`;
    selector.select(selected);
	}
	// --- contract state callbacks
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
