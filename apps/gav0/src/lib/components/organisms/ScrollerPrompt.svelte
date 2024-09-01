<script lang="ts">
// --- lib deps
// --- framework
import { onMount } from 'svelte'
// --- external components
// --- components
import Message1 from "$lib/components/molecules/Message1.svelte";
import MessageRounded1 from "$lib/components/molecules/MessageRounded1.svelte";
import FormPrompt1 from "$lib/components/molecules/FormPrompt1.svelte";

// --- app lib
import type { MessageWithImage } from "$lib/models/components/types";
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let messages: MessageWithImage[] = [];
export let promptButtonText: string;
export let promptSuggestion: string;
export let promptPos: "top" | "bottom" = "top";
// --- component state properties
let elemChat: HTMLElement;
// --- svelte bound variables
// let instance = undefined
// --- svelte lifecycle callbacks
// test support hook
// onMount(async () => {})
// --- on dom event callbacks
// --- contract state callbacks
// --- component helpers
function scrollBottom(behavior?: ScrollBehavior): void {
	elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
}
onMount(() => {
  if (promptPos === "bottom")
    scrollBottom('smooth');
});

</script>
<!-- Messages Container - Modify the height according to your need -->
<!--<div class="flex {heightCss} w-full flex-col"> -->

<div class="flex-grow-0 flex-shrink-0 basis-2/3 md:basis-2/3 md:mr-4">
  {#if promptPos === "top"}
  <div class="mb-4">
    <FormPrompt1 buttonText={promptButtonText} suggestion={promptSuggestion}/>
  </div>
  {/if}

  <!-- Messages -->
  <div bind:this={elemChat}
    class="flex-1 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7"
  >
    {#each messages as message, i (message.id)}
      {#if i % 2 === 0}
        <Message1 id={message.id} text={message.text} image={message.image}/>
      {:else}
        <MessageRounded1 id={message.id} text={message.text} image={message.image} />
      {/if}
    {/each}
  </div>
  {#if promptPos === "bottom"}
    <FormPrompt1 buttonText={promptButtonText} suggestion={promptSuggestion}/>
  {/if}
</div>
