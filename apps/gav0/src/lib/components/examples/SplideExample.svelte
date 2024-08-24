<script lang="ts">
	// --- lib deps
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';
	// --- framework
	// import { onMount , setContext, getContext, onDestroy } from 'svelte'
	// --- external components
	// --- components
	// --- app lib
	// import { getLogger } from '$lib/log.js'
	// --- app stores

	import biomesTeaser from '$lib/assets/game-biomes/teaser-title.png';
	import dfAresTeaser from '$lib/assets/game-dfares/teaser-title.png';
	import downStreamTeaser from '$lib/assets/game-downstream/teaser-title.png';

	// --- constants
	//const log = getLogger('SplideExample')
	// --- data imports
	// --- component properties
	// --- component state properties

	let images = [
		{ src: biomesTeaser, alt: 'Biomes teaser' },
		{ src: dfAresTeaser, alt: 'DFAres teaser' },
		{ src: downStreamTeaser, alt: 'Downstream teaser' }
	];
	// --- svelte bound variables
	// let instance = undefined
	// --- svelte lifecycle callbacks
	// test support hook
	// onMount(async () => {})
	// --- on dom event callbacks
	// --- contract state callbacks
	// --- component helpers
</script>

<Splide aria-label="What's on">
	{#each images as image}
		<SplideSlide>
			<img src={image.src} alt={image.alt} />
		</SplideSlide>
	{/each}
</Splide>

<style>
</style>
