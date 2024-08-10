<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	const dispatch = createEventDispatcher();
	/**
	 * providerSelected(provider)
	 */

	/**
	 * @type {{name:string, chainId:string, ticker?:string, img?:string, imgAlt?:string}[]} x
	 */
	export let providers = [];
	export let selected = undefined;

	let lastName = undefined;

	let btnClass = undefined;
	$: btnClass = selected?.name
		? 'btn variant-ghost w-48 justify-between'
		: 'btn variant-filled w-48 justify-between';

	const popupCombobox = {
		//event: 'focus-click', // apparently not on safari
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	type ItemLike = {
		name: string;
	};

	function onClick<T extends ItemLike>(event: MouseEvent, item: T) {
		console.log(`ProviderList#onClick ${JSON.stringify(event?.detail)}`);
		lastName = item?.name;
		dispatch('providerSelected', item);
	}

	// $: {
	//   if (lastName !== selected?.name) {
	//     lastName = selected?.name;
	//     dispatch('providerSelected', selected);
	//   }
	// }
</script>

<button class={btnClass} use:popup={popupCombobox}>
	<div class="flex flex-row">
		{#if selected?.chainId}
			<span class="badge bg-primary-500 capitalize">{selected?.chainId}</span>
		{/if}
		<span class="px-1.5 capitalize">{selected?.name ?? 'Connect'}</span>
		{#if providers}
			<span>↓</span>
		{/if}
	</div>
</button>
<div class="card w-48 py-2 shadow-xl" data-popup="popupCombobox">
	{#if providers}
		<ListBox rounded="rounded-none">
			{#each providers as item}
				<ListBoxItem
					bind:group={selected}
					name="medium"
					value={item}
					on:click={(event) => onClick(event, item)}
				>
					<div class="flex flex-row">
						<span class="badge bg-primary-500">{item.chainId}</span>
						<span class="px-1.5">{item.id}</span>
					</div>
				</ListBoxItem>
			{/each}
		</ListBox>
		<div class="bg-surface-100-800-token arrow" />
	{/if}
</div>
