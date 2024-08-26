<script lang="ts">
	// --- lib depsa
  import type {FormMethod} from "$lib/components/molecules/forms";
	// --- framework
	// import { onMount , setContext, getContext, onDestroy } from 'svelte'
	// --- external components
	// --- components
	// --- app lib
	//import { getLogger } from '$lib/log.js'
	// --- app stores
	// --- constants
	// const log = getLogger('PromptMessage')
	// --- data imports
	// --- component properties
  export let method: FormMethod = "POST";
  export let action: string;
  export let placeholder: string = "Describe the image you want";
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

<!-- Prompt Messages Container - Modify the height according to your need -->
<div class="flex h-[97vh] w-full flex-col">
	<form
    method={method} action={action}
		class="flex w-full items-center rounded-b-md border-t border-slate-300 bg-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
	>
		<label for="chat" class="sr-only">{placeholder}</label>
		<textarea
			id="chat-input"
			rows="1"
			class="mx-2 flex min-h-full w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-400 dark:focus:border-blue-600 dark:focus:ring-blue-600"
			placeholder={placeholder}
		></textarea>
		<div>
			<button
				class="inline-flex hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-600 sm:p-2"
				type="submit"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					aria-hidden="true"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M10 14l11 -11"></path>
					<path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
					></path>
				</svg>
				<span class="sr-only">Send message</span>
			</button>
		</div>
	</form>
</div>

<style>
</style>
