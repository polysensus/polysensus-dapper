<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import FabricatorTabs from "./FabricatorTabs.svelte";
import FabricatorArtefactDeployer from "./FabricatorArtefactDeployer.svelte";
import BiomesGraffitiPrompt from "$lib/components/organisms/BiomesGraffitiPrompt.svelte";
import BiomesBlueprintPrompt from "$lib/components/organisms/BiomesBlueprintPrompt.svelte";
import BiomesPreviewPane from "$lib/components/organisms/BiomesPreviewPane.svelte";
import BiomesApplicator from "$lib/components/organisms/BiomesApplicator.svelte";

// --- app lib
import blueprintImgSrc0 from '$lib/assets/game-biomes/biomes-blueprint-0.png';
import type { FabricatorComponentData } from '$lib/models/components/types';

// --- app stores
// --- constants
const generatorTypes = ['graffiti', 'blueprints'];
const messagesHeightCss = 'h-[25rem]';
const defaultStride = 2;

const gameId = 'biomes-2024';

// --- data imports
// --- component properties

// pathname should come from the svelte page store `$page.url.pathname`
export let pathname: string;

// data should be loaded from the route page loader, it will be set in the currently selected route
export let data: FabricatorComponentData;

// --- component state properties
let meta: {generatorType: string} = {generatorType: routeGenerator(pathname)};
// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers

function routeGenerator(route: string): string {
  return route.split('/').pop() ?? "unknown";
}
</script>
<div class="flex flex-col md:flex-row md:h-screen">
  <div class="flex-grow-0 flex-shrink-0 basis-full md:basis-2/3 md:mr-4">
    <div class="card rounded-filled variant-ghost p-4 h-[10%] mt-8 ml-8 mr-8 mb-4">
      <h1>The Biomes Fabricator</h1>
      <p>Create graffiti and leave your mark on the world</p>
      <p>Re-mix an existing Biomes blueprint to create a build for your custom biomes
          <a class="text-blue-500 underline hover:text-blue-700 hover:underline"
          href='https://docs.biomes.aw/utils#builds'  target="_blank" rel="noopener noreferrer">experience</a></p>
    </div>
    <FabricatorTabs {pathname} {gameId} {generatorTypes}>
      <div slot="tabname" let:generatorType>
        {#if (generatorType === 'graffiti')}
          <span>Biomes Graffiti</span>
        {:else if (generatorType === 'blueprints')}
          <span>Biomes Blueprints</span>
        {/if}
      </div>
      <div slot="panel" let:generatorType>
      {#if (generatorType === 'graffiti')}
        <BiomesGraffitiPrompt  messages={data.content}/>
      {:else if (generatorType === 'blueprints')}
        <BiomesBlueprintPrompt heightCss={messagesHeightCss} panels={data.content} stride={data.stride ?? defaultStride}/>
      {/if}
    </FabricatorTabs>
  </div>
  <div class="flex-grow-0 flex-shrink-0 basis-full md:basis-1/3 mt-4">
    <FabricatorArtefactDeployer>
      <div slot="top">
        <BiomesPreviewPane image={{src: blueprintImgSrc0, alt: "Biomes preview image"}} meta={meta}/>
      </div>
      <div slot="bottom">
        <BiomesApplicator image={{src: blueprintImgSrc0, alt: "Biomes preview image"}} meta={meta}/>
      </div>
    </FabricatorArtefactDeployer>
  </div>
</div>
<style>
</style>