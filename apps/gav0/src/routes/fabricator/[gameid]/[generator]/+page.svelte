<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
import { page } from '$app/stores';
// --- external components
// --- components
import FabricatorPage from "$lib/components/pages/FabricatorPage.svelte";
// --- app lib
import type { FabricatorComponentData } from '$lib/models/components/types';
// --- app stores
// --- constants

// --- data imports
// --- component properties
export let data: FabricatorComponentData;

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
<FabricatorPage {data} pathname={$page.url.pathname}/>
<style>
</style>