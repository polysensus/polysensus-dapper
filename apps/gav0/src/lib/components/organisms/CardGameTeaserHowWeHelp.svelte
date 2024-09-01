<script lang="ts">
	import hljs from "highlight.js";

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
          fabLink?: { fabId: string, buttonText: string };
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
  function route(gameId: string, generatorType: string): string {
    return `/fabricator/${gameId}/${generatorType}`;
  }
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
                {#if !helper.fabLink}
								<span class="badge variant-ghost"
									><i class="fa fa-gift" aria-hidden="true"></i></span>
                {/if}
								<span class="flex-auto">
									<dt>{helper.name} </dt>
									<dd>{helper.description}</dd>
                  {#if helper.fabLink}
									  <a href={route(game.gameId, helper.fabLink.fabId)} class="btn variant-outline launcher-button">
									  	<span>{helper.fabLink.buttonText}</span>
									  	<span><i class="fa fa-compass-drafting" aria-hidden="true"></i></span>
									  </a>
                  {/if}
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
