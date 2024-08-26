<script lang="ts">
	// --- lib deps
	import type { GameDiscoverySelector } from '$lib/components/organisms';

	// --- framework
	// import { onMount , setContext, getContext, onDestroy } from 'svelte'
	// --- external components
	// --- components
	import CardGameTeaserAbout from '$lib/components/organisms/CardGameTeaserAbout.svelte';
	import CardGameTeaserHowWeHelp from '$lib/components/organisms/CardGameTeaserHowWeHelp.svelte';
	import CardGameTeaserLaunchPad from '$lib/components/organisms/CardGameTeaserLaunchPad.svelte';

	// --- app lib
	// --- app stores
	// --- constants
	// --- data imports
	// --- component properties

	export let selector: GameDiscoverySelector;
	export let selected: string;

	$: selector.select(selected);
	$: teaser = get('teaser', selector, selected);
	$: augmentation = get('augmentation', selector, selected);
	$: launchPad = get('launchPad', selector, selected);

	// get is used to cause a syntactic dependency that svelte's reactivity system can track
	function get(key: string, selector: GameDiscoverySelector, _ /*selected*/) {
		return selector[key];
	}

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

<div class="flex flex-col md:flex-row justify-between gap-4">
	{#if selected}
  <div class="mb-4 md:mb-0 flex-1 max-w-1/3">
		<CardGameTeaserAbout game={teaser} />
  </div>
  <div class="mb-4 md:mb-0 flex-1">
  	<CardGameTeaserHowWeHelp game={augmentation} />
  </div>
  <div class="flex-1">
		<CardGameTeaserLaunchPad game={launchPad} />
  </div>
	{/if}
</div>

<style>
</style>
