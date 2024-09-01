<script lang="ts">
// --- lib deps
// --- framework
// import { onMount , setContext, getContext, onDestroy } from 'svelte'
// --- external components
// --- components
import ButtonSubmit1 from "$lib/components/atoms/ButtonSubmit1.svelte";
import ButtonVoiceInput1 from "$lib/components/atoms/ButtonVoiceInput1.svelte";
// --- app lib
// --- app stores
// --- constants
// --- data imports
// --- component properties
export let buttonText: string = "Send";
export let suggestion: string = "Desribe what you want";
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
<form class="mt-2">
  <label for="chat-input" class="sr-only">Enter your prompt</label>
  <div class="relative">
    <ButtonVoiceInput1/>
    <textarea
      id="chat-input"
      class="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
      placeholder={suggestion}
      rows="1"
      required
    ></textarea>
    <ButtonSubmit1 text={buttonText} text2={suggestion} />
  </div>
</form>
