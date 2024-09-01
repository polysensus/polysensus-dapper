<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
// --- components
// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties

// pathname should come from the svelte page store `$page.url.pathname`
export let pathname: string;
export let gameId: string;
export let generatorTypes: string[];


// --- component state properties
// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

function route(generatorType: string): string {
  return `/fabricator/${gameId}/${generatorType}`;
}
function routeGenerator(route: string): string | undefined {
  return route.split('/').pop();
}
</script>
<TabGroup>
  {#each generatorTypes as generatorType}
    <TabAnchor href={route(generatorType)} selected={routeGenerator(pathname) === generatorType}>
      <slot name="tabname" generatorType={generatorType}/>
      {#if !$$slots.tabname}
        {generatorType}
      {/if}
    </TabAnchor>
  {/each}

	<svelte:fragment slot="panel">
    <slot name="panel" generatorType={routeGenerator(pathname)}/>
	</svelte:fragment>

</TabGroup>
<style>
</style>