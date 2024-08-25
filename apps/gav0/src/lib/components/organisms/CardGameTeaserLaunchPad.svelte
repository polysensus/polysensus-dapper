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
				launchers: {
					id: string;
					name: string;
					iconName?: string;
					description: string;
					launchUrl?: string;
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
	// --- component launchers
</script>

<div class="card rounded-lg shadow-lg">
	{#if game}
		<header class="card-header">
			<h2 class="card-header-title">Game Launchers</h2>
			<p>{game.logLine}</p>
		</header>
		<section class="p-4">
			<p>{game.blurb}</p>
			{#if game.launchers}
				<div class="card rounded-lg">
					<dl class="list-dl">
						{#each game.launchers as launcher (launcher.id)}
							<div class="launcher-contaner">
								<span class="badge bg-primary-500">
									<i class="fa {launcher.iconName ?? 'fa-smile-o'}" aria-hidden="true"></i>
								</span>
								<span class="flex-auto">
									<dt>{launcher.name}</dt>
									<dd>
										{launcher.description}
									</dd>
								</span>
								{#if launcher.launchUrl}
									<a href={launcher.launchUrl} class="btn variant-filled launcher-button">
										<span>Launch {launcher.name}</span>
										<span><i class="fa fa-rocket" aria-hidden="true"></i></span>
									</a>
								{/if}
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
	.launcher-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.launcher-button {
		margin-left: auto;
	}
</style>
