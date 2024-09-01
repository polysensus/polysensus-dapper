<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import ScrollerPrompt from "./ScrollerPrompt.svelte";
// --- app lib
import type { MessageWithImage } from "$lib/models/components/types";
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let messages: MessageWithImage[] = [];

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

<ScrollerPrompt {messages} promptButtonText="Generate" promptSuggestion="Describe your graffiti"/>