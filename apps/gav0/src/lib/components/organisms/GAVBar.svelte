<script lang="ts">
	// --- lib deps
	// --- framework
	// import { onMount , setContext, getContext, onDestroy } from 'svelte'
	// --- external components
	import { AppBar } from '@skeletonlabs/skeleton';
	// --- components
	// --- app lib
	// --- app stores
	// --- constants
	// --- data imports
	// --- component properties
	export let socials: { twitter: string; discord: string } = {
		twitter: 'https://twitter.com/polysensus',
		discord: 'https://discord.gg/rjTr6U7Z3u'
	};
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

<!--
<AppBar gridColumns="grid-cols-3" slotDefault="place-content-center" slotTrail="place-content-end">
-->
<AppBar>
	<svelte:fragment slot="lead">
		<a class="btn-icn variant-solid home-link" href="/" target="_blank" rel="noopener noreferrer"
			><i class="fas fa-home"></i></a
		>
		<div />

		<a
			class="btn variant-outline"
			href="https://www.polysensus.com"
			target="_blank"
			rel="noopener noreferrer">Polysensus</a
		>
	</svelte:fragment>
	<div class="center-content">G A V</div>
	<svelte:fragment slot="trail">
		{#if socials}
			<a href={socials.twitter} target="_blank" rel="noopener noreferrer" class="icon-link">
				<i class="fab fa-twitter"></i>
			</a>
			<a href={socials.discord} target="_blank" rel="noopener noreferrer" class="icon-link">
				<i class="fab fa-discord"></i>
			</a>
		{/if}
		<slot />
	</svelte:fragment>
</AppBar>
<style>
	.app-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.center-content {
		flex-grow: 1;
		text-align: center;
	}
	.home-link {
		margin-right: 10px; /* Adjust the value as needed */
	}
</style>
