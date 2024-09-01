<script lang="ts">
// --- lib deps
// --- framework
import { onMount } from 'svelte'
// --- external components
// --- components
import Message1 from "$lib/components/molecules/Message1.svelte";
import MessageRounded1 from "$lib/components/molecules/MessageRounded1.svelte";

// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let messages: {id:number; text: string}[] = [];
export let heightCss = 'h-[25rem]';
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
  scrollBottom('smooth');
});

</script>
<!-- Messages Container - Modify the height according to your need -->
<div class="flex {heightCss} w-full flex-col">
  <!-- Messages -->
  <div bind:this={elemChat}
    class="flex-1 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7"
  >
    {#each messages as message, i (message.id)}
      {#if i % 2 === 0}
        <Message1 id={message.id} text={message.text} />
      {:else}
        <MessageRounded1 id={message.id} text={message.text} />
      {/if}
    {/each}
  </div>
</div>
