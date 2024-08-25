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
				gameId: string;
				logLine: string;
				blurb: string;
				helpers: {
					id: string;
					name: string;
					description: string;
				}[];
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
			<h2 class="card-header-title">Easy on Board Augmentations</h2>
			<p class="card-header-title">{game.logLine}</p>
		</header>
		<section class="p-4">
			<p>{game.blurb}</p>

			{#if game.helpers}
				<div class="card">
					<dl class="list-dl">
						{#each game.helpers as helper (helper.id)}
							<div>
								<span class="badge bg-primary-500"
									><i class="fa fa-gift" aria-hidden="true"></i></span
								>
								<span class="flex-auto">
									<dt>{helper.name}</dt>
									<dd>{helper.description}</dd>
								</span>
							</div>
							<!-- ... -->
						{/each}
					</dl>
				</div>
			{/if}
		</section>
		<footer class="card-footer">
			<a href="/games/{game.gameId}" class="card-footer-item">Game Link</a>
		</footer>
	{/if}
</div>

<style>
</style>
