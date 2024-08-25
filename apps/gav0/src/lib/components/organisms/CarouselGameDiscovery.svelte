<script lang="ts">
	// --- lib deps

	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import { onMount } from 'svelte';

	let main: Splide;
	let thumbs: SplideSlide;

	// const slides = randomImages('teasers', 6);
	export let slides: { src: string; alt: string }[];

	const mainOptions = {
		type: 'loop',
		perPage: 2,
		perMove: 1,
		gap: '1rem',
		pagination: false,
		height: '21rem'
	};

	const thumbsOptions = {
		type: 'slide',
		rewind: true,
		gap: '1rem',
		pagination: false,
		fixedWidth: 110,
		fixedHeight: 70,
		cover: true,
		focus: 'center' as const,
		isNavigation: true,
		updateOnMove: true,
	};

	onMount(() => {
		if (main && thumbs) {
			main.sync(thumbs.splide);
		}
	});
</script>

<div class="wrapper">
	<Splide
		on:moved
		options={mainOptions}
		bind:this={main}
		aria-labelledby="thumbnails-example-heading"
	>
		{#each slides as slide}
			<SplideSlide>
				<img src={slide.src} alt={slide.alt} />
			</SplideSlide>
		{/each}
	</Splide>

	<Splide on:moved options={thumbsOptions} bind:this={thumbs}>
		{#each slides as slide}
			<SplideSlide>
				<img src={slide.src} alt={slide.alt} />
			</SplideSlide>
		{/each}
	</Splide>
</div>

<style>
	.splide-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem; /* Adjust the value as needed */
	}
</style>
