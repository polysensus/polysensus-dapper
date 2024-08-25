<script lang="ts">
	// --- lib deps
	// --- framework
	// import { onMount , setContext, getContext, onDestroy } from 'svelte'
	// --- external components
	// --- components
	// --- app lib
	// --- app stores
	// --- constants
	// --- data imports
	// --- component properties
	export let game:
		| {
				id: string;
				title: string;
				logLine: string;
				blurb: string;
		  }
		| undefined;
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

<div class="card rounded-none">
	{#if game}
		<header class="card-header">
			<h2 class="card-header-title">About</h2>
			<p class="card-header-icon">{game.title}: {game.logLine}</p>
		</header>
		<section class="p-4">
			<p>{game.blurb}</p>
		</section>
		<footer class="card-footer">
			<a href="/games/{game.id}" class="card-footer-item">More</a>
		</footer>
	{/if}
</div>

<style>
</style>
