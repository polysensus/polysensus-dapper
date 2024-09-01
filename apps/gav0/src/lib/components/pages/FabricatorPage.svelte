<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
import { page } from '$app/stores';
// --- external components
// --- components
import BiomesFabricator from "$lib/components/organisms/BiomesFabricator.svelte";
// --- app lib
import type { FabricatorComponentData } from '$lib/models/components/types';
// --- app stores
// --- constants

type ComponentType = typeof BiomesFabricator /* | typeof AnotherFabricator */;

const fabs: {[key: string]: {component: ComponentType}} = {
  'biomes-2024': {component: BiomesFabricator}
  // 'another-2024': AnotherFabricator
}

// --- data imports
// --- component properties
export let data: FabricatorComponentData;
export let pathname: string;

$: pathparts = pathname.split('/')
$: gameId = pathparts[pathparts.length - 2];
$: fabricator = fabs[gameId].component;

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
  <svelte:component this={fabricator} {data} {pathname}/>
<!-- <BiomesFabricator {data} {pathname}/> -->
<style>
</style>